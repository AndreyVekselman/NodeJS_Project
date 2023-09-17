const usersRouter = require("express").Router();

const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");

const { User, validateUser } = require("../models/users");

const authMW = require("../middlware/authMW");
const chalk = require("chalk");
const { trusted } = require("mongoose");

// ----Create user
usersRouter.post("/", async (req, res) => {
  //validate user input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).json({ message: "User already registered" });
    return;
  }
  //process
  user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);

  await user.save();
  //results
  res.json(_.pick(user, ["_id", "name", "email", "address"]));
});

//Login User
usersRouter.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).json({ message: "Invalid email or password!!" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid email or password!!" });
    return;
  }
  //process
  const token = user.generateAuthToken();

  //response
  res.json(token);
});

//Get all users
usersRouter.get("/", authMW("isAdmin"), async (req, res) => {
  allUsers = await User.find();
  res.json(allUsers);
});

//Get User informaion by ID
usersRouter.get("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select(
    "-password -__v"
  );
  if (!user) {
    res.status(401).json({ message: "user Not found" });
    return;
  }
  res.json(user);
});

//Edit user
usersRouter.put("/:id", authMW("userOwner"), async (req, res) => {
  //validate user input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system
  let user = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user._id },
  });
  if (user) {
    res.status(401).json({ message: "This Email all ready in use" });
    return;
  }
  //process
  user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { new: true }
  );
  //response
  if (!user) {
    res.status(401).json({ message: "user Not found" });
    return;
  }
  res.json(
    _.pick(user, ["_id", "name", "email", "isBusiness", "isAdmin", "address"])
  );
});

//Change a business status
usersRouter.patch("/:id", authMW("userOwner"), async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user._id },
  });
  if (user) {
    res.status(401).json({ message: "wrong user parameters" });
    return;
  }
  //process
  user = await User.findOne({ _id: req.params.id });
  if (!user) {
    res.status(401).json({ message: "user Not found" });
    return;
  }
  user.isBusiness = !user.isBusiness;
  //response
  await user.save();
  res.json(_.pick(user, ["id", "name", "email", "isBusiness"]));
});

//Delete User by ID
usersRouter.delete("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
  const user = await User.findOneAndRemove({ _id: req.params.id });
  if (!user) {
    res.status(401).json({ message: "user Not found" });
    return;
  }
  res.json(user);
});

// My Games
usersRouter.delete("/deleteAll", async (req, res) => {
  await User.deleteMany();
  console.log(chalk.yellow("All users are deleted"));
  res.json({ message: "All users are deleted" });
});

// server test
usersRouter.get("/test/test", (req, res) => {
  res.json({ message: "Work -test from users Route" });
});

//
function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}
module.exports = usersRouter;

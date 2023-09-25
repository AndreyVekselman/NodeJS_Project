const usersRouter = require("express").Router();

const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");

const { User, validateUser } = require("../models/users");
const logger = require("../middlware/logger");
const userBlock = require("../middlware/userBlock");

const authMW = require("../middlware/authMW");
const chalk = require("chalk");
const { trusted } = require("mongoose");

// ----Create user
usersRouter.post("/", async (req, res) => {
  //validate user input
  const { error } = validateUser(req.body);
  if (error) {
    error.statusCode = 400;
    logger(error.statusCode, error.details[0].message);
    res.status(error.statusCode).json({ message: error.details[0].message });
  }
  //validate system
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const err = new Error("User already registered");
    err.statusCode = 400;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });

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
    error.statusCode = 400;
    logger(error.statusCode, error.details[0].message);
    res.status(error.statusCode).json({ message: error.details[0].message });
    return;
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const err = new Error("Invalid email or password!!");
    err.statusCode = 400;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  //-------------
  const isBlocked = userBlock(isPasswordValid, user);
  if (isBlocked) {
    const err = new Error("user blocked");
    err.statusCode = 500;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  //---------------
  if (!isPasswordValid) {
    const err = new Error("Invalid email or password!!");
    err.statusCode = 400;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
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
  try {
    const user = await User.findOne({ _id: req.params.id }).select(
      "-password -__v"
    );
    res.json(user);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

//Edit Existin user
usersRouter.put("/:id", authMW("userOwner"), async (req, res) => {
  //validate user input
  const { error } = validateUser(req.body);
  if (error) {
    error.statusCode = 400;
    logger(error.statusCode, error.details[0].message);
    res.status(error.statusCode).json({ message: error.details[0].message });
    return;
  }
  //validate system
  let user = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user._id },
  });
  if (user) {
    const err = new Error("This Email all ready in use");
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  //process
  user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { new: true }
  );
  //response
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
    const err = new Error("wrong user parameters");
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  //process
  user = await User.findOne({ _id: req.params.id });
  if (!user) {
    const err = new Error("user Not found");
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  user.isBusiness = !user.isBusiness;
  //response
  await user.save();
  res.json(_.pick(user, ["id", "name", "email", "isBusiness"]));
});

//Delete User by ID
usersRouter.delete("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id });
    res.json(user);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

// My Games-----------
usersRouter.delete("/delete/deleteAll", async (req, res) => {
  await User.deleteMany();
  console.log(chalk.red("All users are deleted"));
  res.json({ message: "All users are deleted" });
});

// server test
usersRouter.get("/test/test", (req, res) => {
  res.json({ message: "Work -test from users Route" });
});

//
function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email({ tlds: false }),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}
module.exports = usersRouter;

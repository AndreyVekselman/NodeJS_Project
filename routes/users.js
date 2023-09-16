const usersRouter = require("express").Router();

const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");

const { User, validateUser } = require("../models/users");

const authMW = require("../middlware/authMW");
// const { Card } = require("../models/cards");
const chalk = require("chalk");
const { trusted } = require("mongoose");

// usersRouter.patch("/cards", authMW, async (req, res) => {
//   const { error } = validateCards(req.body);
//   if (error) {
//     res.status(400).json(error.details[0].message);
//   }
//   const cards = await Card.find({ bizNumber: { $in: req.body.cards } });
//   if (cards.length != req.body.cards.length) {
//     res.status(400).send("at least some of numbers were not found");
//     return;
//   }

//   const user = await User.findById(req.user._id);
//   user.cards = [...new Set([...user.cards, ...req.body.cards])];
//   await user.save();
//   res.json(user);
// });

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
    res.status(400).send("User already registered");
    return;
  }
  //process
  user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);

  await user.save();
  //results
  res.json(_.pick(user, ["_id", "name", "email", "biz", "address"]));
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
    res.status(400).send("Invalid email !!");
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordValid) {
    res.status(400).send("Invalid !! password");
    return;
  }
  //process
  const token = user.generateAuthToken();

  //response
  res.send({ token });
});

//Get all users
usersRouter.get("/", authMW("isAdmin"), async (req, res) => {
  allUsers = await User.find();
  res.send(allUsers);
});

//Get User informaion by ID
usersRouter.get("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select(
    "-password -__v"
  );

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
    res.status(401).send("Email all ready exist");
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
    res.status(401).send("wrong user parameters");
    return;
  }
  //process
  user = await User.findOne(req.params._id);
  user.isBusiness = !user.isBusiness;
  //response
  await user.save();
  res.json(_.pick(user, ["id", "name", "email", "isBusiness"]));
});

// My Games
usersRouter.delete("/deleteAll", async (req, res) => {
  await User.deleteMany();
  console.log(chalk.yellow("All users are deleted"));
  res.json("All users are deleted");
});

// server test
usersRouter.get("/test/test", (req, res) => {
  res.json("Work -test from users Route");
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

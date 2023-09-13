const usersRouter = require("express").Router();

const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validateUser, validateCards } = require("../models/users");

const authMW = require("../middelware/authMW");
const { Card } = require("../models/cards");

usersRouter.patch("/cards", authMW, async (req, res) => {
  const { error } = validateCards(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
  }
  const cards = await Card.find({ bizNumber: { $in: req.body.cards } });
  if (cards.length != req.body.cards.length) {
    res.status(400).send("at least some of numbers were not found");
    return;
  }

  const user = await User.findById(req.user._id);
  user.cards = [...new Set([...user.cards, ...req.body.cards])];
  await user.save();
  res.json(user);
});

usersRouter.get("/me", authMW, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  res.json(user);
});

usersRouter.post("/", async (req, res) => {
  //validate users input
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

  //reuslts
  res.json(_.pick(user, ["_id", "name", "email", "biz"]));
});

module.exports = usersRouter;

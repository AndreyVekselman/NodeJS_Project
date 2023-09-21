const cardsRouter = require("express").Router();
const _ = require("lodash");
const { Card, validateCard, generateBizNumber } = require("../models/cards");
const authMW = require("../middlware/authMW");
const chalk = require("chalk");
const logger = require("../middlware/logger");

//test routes
cardsRouter.get("/test", async (req, res) => {
  res.json({ message: "hello from cards route" });
});

//Delete All Cards
cardsRouter.delete("/deleteAll", async (req, res) => {
  await Card.deleteMany();
  console.log(chalk.red("All cards are deleted"));
  res.json({ message: "All cards are deleted" });
});

//Get All Cards
cardsRouter.get("/", async (req, res) => {
  try {
    const allCards = await Card.find();
    res.json(allCards);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

//Create a new Card
cardsRouter.post("/", authMW("isBusiness"), async (req, res) => {
  //validate card input//
  const { error } = validateCard(req.body);
  if (error) {
    error.statusCode = 400;
    logger(error.statusCode, error.details[0].message);
    res.status(error.statusCode).json(error.details[0].message);
    return;
  }

  //process//
  try {
    const card = new Card({
      ...req.body,
      bizNumber: await generateBizNumber(),
      user_id: req.user._id,
    });
    await card.save();
    //response//
    res.json(card);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

//Get user Cards
cardsRouter.get("/my-cards", authMW(), async (req, res) => {
  try {
    const userCards = await Card.find({
      user_id: req.user._id,
    });
    res.json(userCards);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

// Get Card by ID
cardsRouter.get("/:id", async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
    });
    res.json(card);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

//Update Existing Card by creater
cardsRouter.put("/:id", authMW(), async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    error.statusCode = 401;
    logger(error.statusCode, error.details[0].message);
    res.status(error.statusCode).json(error.details[0].message);
    return;
  }
  try {
    const card = await Card.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    );

    res.json(card);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

//Add favorit cards
cardsRouter.patch("/:id", authMW(), async (req, res) => {
  try {
    let card = await Card.findOne({
      _id: req.params.id,
    });
    if (!card) {
      res.json(card);
      return;
    }
    let allReadyLiked = false;
    card.likes.forEach((e) => {
      if (e._id == req.user._id) {
        allReadyLiked = true;
      }
    });
    if (!allReadyLiked) {
      card.likes.push(req.user._id);
      await card.save();
    }
    res.json(card);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

//DELETE card by id
cardsRouter.delete("/:id", authMW("isAdmin", "cardOwner"), async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
    });
    res.json(card);
  } catch (err) {
    err.statusCode = 401;
    logger(err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  }
});

module.exports = cardsRouter;

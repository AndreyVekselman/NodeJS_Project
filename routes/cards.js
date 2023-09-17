const cardsRouter = require("express").Router();
const _ = require("lodash");
const { Card, validateCard, generateBizNumber } = require("../models/cards");
const authMW = require("../middlware/authMW");
const chalk = require("chalk");

//test routes
cardsRouter.get("/test", async (req, res) => {
  res.json({ message: "hello from cards route" });
});

//Delete All Cards
cardsRouter.delete("/deleteAll", async (req, res) => {
  await Card.deleteMany();
  console.log(chalk.yellow("All cards are deleted"));
  res.json({ message: "All cards are deleted" });
});

//Get ALl Cards
cardsRouter.get("/", async (req, res) => {
  allCards = await Card.find();
  if (!allCards.length) {
    res.json({ message: "no cards found" });
    return;
  }
  res.json(allCards);
});

//create new Card
cardsRouter.post("/", authMW(), async (req, res) => {
  //validate card input//
  const { error } = validateCard(req.body);

  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //process//

  const card = new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      "https://images.pexels.com/photos/13221803/pexels-photo-13221803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    bizNumber: await generateBizNumber(),
    user_id: req.user._id,
  });

  await card.save();

  //results//
  res.json(card);
});

cardsRouter.put("/:id", authMW, async (req, res) => {
  const { error } = validateCard(req.body);

  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

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
  if (!card) {
    res.status(404).send("the card with the given ID was not found");
    return;
  }
  res.json(card);
});

cardsRouter.delete("/:id", authMW, async (req, res) => {
  const card = await Card.findByIdAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(404).send("the card with the given ID was not found");
    return;
  }
  res.json(card);
});

cardsRouter.get("/:id", authMW, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(404).send("the card with the given ID was not found");
    return;
  }
  res.json(card);
});

module.exports = cardsRouter;

const authRouter = require("express").Router();
const Joi = require("joi");
const { User } = require("../models/users");
const bcrypt = require("bcrypt");

authRouter.post("/", async (req, res) => {
  //validate users input

  const { error } = validate(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  // validate system

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

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

module.exports = authRouter;

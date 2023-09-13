require("dotenv/config");

const config = require("config");

const mongoose = require("mongoose");

const express = require("express");

const morgan = require("morgan");

const chalk = require("chalk");

const cors = require("cors");

const app = express();

const usersRouter = require("./routes/users");

const authRouter = require("./routes/auth");

const cardsRouter = require("./routes/cards");

mongoose
  .connect(config.get("mongoDB.MONGO_URI"))
  .then(() => console.log(chalk.green.bold("connected to db successfully")))
  .catch((err) =>
    console.log(chalk.red.bold("could not connected to db"), err)
  );

app.use(
  morgan(chalk.yellow(
    `DATE: :date[web] ; METHOD: :method ; URL: :url ; STATUS: :status ; RESPONSE TIME: :response-time ms`)
  )
);

app.use(cors());

app.use(express.json());

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/cards", cardsRouter);

const PORT = config.get("server.PORT");
app.listen(PORT, () => console.log(chalk.blue(`listening on port ${PORT}`)));
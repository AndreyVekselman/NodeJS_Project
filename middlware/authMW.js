const jwt = require("jsonwebtoken");
const config = require("config");
const logger = require("./logger");
const { Card } = require("../models/cards");

function authMW(...roles) {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
      const statusCode = 401;
      const errMessage = "Access Denied. No token provided";
      res.statusMessage = errMessage;
      logger(statusCode, errMessage);
      res.status(statusCode).json({ message: errMessage });
      return;
    }

    try {
      const decode = jwt.verify(token, config.get("auth.JWT_SECRET"));
      req.user = decode;
      if (!roles || roles.length == 0) {
        next();
      } else if (roles.includes("isAdmin") && req.user.isAdmin) {
        next();
      } else if (roles.includes("userOwner") && req.user._id == req.params.id) {
        next();
      } else if (roles.includes("cardOwner")) {
        try {
          const card = await Card.findOne({
            _id: req.params.id,
            user_id: req.user._id,
          });
          if (!card) {
            const statusCode = 401;
            const errMessage =
              "Card with that ID was not found or you are not it's owner";
            logger(statusCode, errMessage);
            res.statusMessage = errMessage;
            res.status(statusCode).json({
              message: errMessage,
            });
            return;
          } else {
            next();
          }
        } catch (err) {
          const statusCode = 401;
          const errMessage = "No card's founded";
          logger(statusCode, errMessage);
          res.statusMessage(errMessage);
          res.status(statusCode).json({ message: errMessage });
          return;
        }
      } else if (roles.includes("isBusiness") && req.user.isBusiness) {
        next();
      } else {
        const statusCode = 400;
        const errMessage =
          "Access Denied. User does not have the proper authorization";
        logger(statusCode, errMessage);
        res.statusMessage = errMessage;
        res.status(statusCode).json({
          message: errMessage,
        });
        return;
      }
    } catch (err) {
      const statusCode = 400;
      const errMessage = "Invalid Token";
      logger(statusCode, errMessage);
      res.statusMessage = errMessage;
      res.status(statusCode).json({ message: errMessage });
      return;
    }
  };
}

module.exports = authMW;

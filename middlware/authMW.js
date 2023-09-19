const jwt = require("jsonwebtoken");
const config = require("config");
const logger = require("./logger");
const { Card } = require("../models/cards");

function authMW(...roles) {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
      res.statusMessage = "Access Denied. No token provided";
      logger(401, "Access Denied. No token provide");
      res.status(401).json({ message: "Access Denied. No token provided" });
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
            logger(
              401,
              "Card Operation Failed. A Card with that ID was not found or you are not it's owner"
            );
            res.statusMessage =
              "Card Operation Failed. A Card with that ID was not found or you are not it's owner";
            res.status(401).json({
              message:
                "Card Operation Failed. A Card with that ID was not found or you are not it's owner",
            });
            return;
          } else {
            next();
          }
        } catch (err) {
          logger(401, "Error finding any card");
          res.statusMessage("Error finding any card");
          res.status(401).json({ message: "Error finding any card" });
          return;
        }
      } else if (roles.includes("isBusiness") && req.user.isBusiness) {
        next();
      } else {
        logger(
          400,
          "Access Denied. User does not have the proper authorization"
        );
        res.statusMessage =
          "Access Denied. User does not have the proper authorization";
        res
          .status(400)
          .json({
            message:
              "Access Denied. User does not have the proper authorization",
          });
        return;
      }
    } catch (err) {
      logger(400, "Invalid Token");
      res.statusMessage = "Invalid Token";
      res.status(400).send("Invalid Token");
      return;
    }
  };
}

module.exports = authMW;

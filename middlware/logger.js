const fs = require("fs");
const path = require("path");

function fileLogger(statusCode = 200, message = "No error") {
  const err = new Error(message);
  err.statusCode = statusCode;
  const currentDate = new Date().toISOString().slice(0, 10);

  const logFilePath = path.join(__dirname, "../logs", `${currentDate}.log`);

  const logMessage = `[${new Date()}] Status Code: ${err.statusCode}, Error: ${
    err.message
  }\n`;

  if (err.statusCode >= 400) {
    fs.appendFile(logFilePath, logMessage, (appendErr) => {
      if (appendErr) {
        console.error("Error writing to log file:", appendErr);
      }
    });
  }
}

module.exports = fileLogger;

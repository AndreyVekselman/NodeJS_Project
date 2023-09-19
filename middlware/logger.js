const fs = require("fs");
const path = require("path");

function fileLogger(statusCode = 200, message = "No error") {
  const err = new Error(message);
  err.statusCode = statusCode;
  // Get the current date
  const currentDate = new Date().toISOString().slice(0, 10);

  // Define the log file path (logs/yyyy-mm-dd.log)
  const logFilePath = path.join(__dirname, "../logs", `${currentDate}.log`);

  // Format the log message
  const logMessage = `[${new Date()}] Status Code: ${err.statusCode}, Error: ${
    err.message
  }\n`;

  // Append the log message to the log file
  if (err.statusCode >= 400) {
    fs.appendFile(logFilePath, logMessage, (appendErr) => {
      if (appendErr) {
        console.error("Error writing to log file:", appendErr);
      }
    });
  }
}

module.exports = fileLogger;

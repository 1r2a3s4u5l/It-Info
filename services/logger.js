const config = require("config");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint, json, colorize } = format;
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
require("winston-mongodb");
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

let logger;
const Devlog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combine.log", level: "info" }),
  ],
});
const Prodlog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.MongoDB({
      db: config.get("dbUri"),
      options: { useUnifiedTopology: true },
    }),
  ],
});

if (process.env.NODE_ENV == "production") {
  logger = Prodlog;
} else if (process.env.NODE_ENV == "development") {
  logger = Devlog;
}
logger.exceptions.handle(
  new transports.File({ filename: "log/exceptions.log" })
);
logger.rejections.handle(
  new transports.File({ filename: "log/rejections.log" })
);
logger.exitOnError = false;
module.exports = logger;

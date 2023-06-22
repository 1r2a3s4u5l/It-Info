const expressWinston = require("express-winston");
const { format, transports } = require("winston");
const { combine, timestamp, prettyPrint, metadata } = format;
const config = require("config");
require("winston-mongodb");
const expressWinstonLogger = expressWinston.logger({
  transports: [
    new transports.Console({
      db: config.get("dbUri"),
      options: { useUnifiedTopology: true },
    }),
    new transports.Console(),
  ],
  format: combine(timestamp(), prettyPrint(), metadata()),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});
const expressWinstonErrorLogger = expressWinston.errorLogger({
  transports: [new transports.Console()],
  format: combine(prettyPrint()),
});
module.exports = {
  expressWinstonLogger,
  expressWinstonErrorLogger,
};

const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  expressWinstonLogger,
  expressWinstonErrorLogger,
} = require("./middleware/loggermiddleware");
// const expressWinston = require("express-winston");
// const workerWinston = require('./middleware/loggermiddleware');
const logger = require("./services/logger");
const exHbs = require('express-handlebars');

// require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));
// console.log(config.get("access_key"));

// logger.log("info", "LOG ma'lumotlar");
// logger.error("ERROR ma'lumotlar");
// logger.debug("DEBUG ma'lumotlar");
// logger.warn("WARN ma'lumotlar");
// logger.info("INFO ma'lumotlar");
// console.trace("TRACE ma'lumotlar");
// console.table(["Salim", "Karim", "Nodir"]);
// console.table([
//   ["Salim", "20"],
//   ["Karim", "24"],
//   ["Nodir", "26"],
// ]);

const PORT = config.get("port") || 3030;

// process.on("uncaughtException", (ex) => {
//   console.log("uncaughtException", ex.message);
//   // process.exit(1)
// });
// process.on("unhandledRejection", (rej) => {
//   console.log("unhandledRejection", rej);
// });
const mainRouter = require("./routes/index.routes");
const errorHandler = require("./middleware/error_handing_middleware");
// const winston = require("winston");

const app = express();
app.use(express.json()); //frontend dan kelatotgan so'rovlarni JSON parse qiladi(taniydi)
app.use(cookieParser()); //frontend dan kelatotgan so'rovlar ichidagi cookie ni o'qiydi yoki taniydi

// app.use(
//   expressWinston.logger({
//     transports: [
//       new winston.transports.Console({
//         json: true,
//         colorize: true,
//       }),
//     ],
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.json()
//     ),
//     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
//     msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
//     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
//     colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
//     ignoreRoute: function (req, res) {
//       return false;
//     }, // optional: allows to skip some log messages based on request and/or response
//   })
// );
// app.use(workerWinston)
// app.use(
//   expressWinston.errorLogger({
//     transports: [new winston.transports.Console()],
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.json()
//       ),
//     })
//     );

// ---------------------------------
const hbs = exHbs.create({
  defaultLayout:"main",
  extname:"hbs"
})

app.engine("hbs",hbs.engine)

app.set("View engine",'hbs')
app.set("views","views")
app.use(express.static("views"))
// ---------------------------

// app.use(expressWinstonLogger);
// console.log(1);
app.use(mainRouter);
// app.use(expressWinstonErrorLogger);

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(config.get("dbUri"));
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Could not connect to database");
  }
}

start();

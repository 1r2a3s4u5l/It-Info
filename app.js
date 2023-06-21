const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const logger = require("./services/logger");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));
// console.log(config.get("access_key"));

logger.log("info", "LOG ma'lumotlar");
logger.error("ERROR ma'lumotlar");
logger.debug("DEBUG ma'lumotlar");
logger.warn("WARN ma'lumotlar");
logger.info("INFO ma'lumotlar");
// console.trace("TRACE ma'lumotlar");
// console.table(["Salim", "Karim", "Nodir"]);
// console.table([
//   ["Salim", "20"],
//   ["Karim", "24"],
//   ["Nodir", "26"],
// ]);

const PORT = config.get("port") || 3030;

process.on("uncaughtException", (ex) => {
  console.log("uncaughtException", ex.message);
  // process.exit(1)
});
process.on("unhandledRejection", (rej) => {
  console.log("unhandledRejection", rej);
});
const mainRouter = require("./routes/index.routes");
const errorHandler = require("./middleware/error_handing_middleware");

const app = express();
app.use(express.json()); //frontend dan kelatotgan so'rovlarni JSON parse qiladi(taniydi)
app.use(cookieParser()); //frontend dan kelatotgan so'rovlar ichidagi cookie ni o'qiydi yoki taniydi
app.use(mainRouter);
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

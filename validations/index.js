const author_email_pass = require("./author_email_pass.validator");
const author = require("./author.validator");
const category = require("./categoryValidator");
const admin = require("./admin.validator");
const user = require("./user.validator");

module.exports = {
  author_email_pass,
  author,
  category,
  admin,
  user
};

const Joi = require("joi");

const Adminschema = Joi.object({
  admin_name: Joi.string().pattern(new RegExp("^[A-Za-z]+$")).required(),
  admin_email: Joi.string().email(),
  admin_password: Joi.string().min(6).max(20),
  admin_is_active: Joi.boolean().default("false"),
  admin_is_creator: Joi.boolean().default("false"),
  created_date: Joi.date(),
  updated_date: Joi.date(),
});
module.exports = Adminschema;

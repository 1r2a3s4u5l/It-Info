const Joi = require("joi");

exports.userValidation = (data) => {
  const schema = Joi.object({
    user_name: Joi.string().pattern(new RegExp("^[A-Za-z]+$")).required(),
    user_email: Joi.string().email(),
    user_password: Joi.string().min(6).max(20),
    user_info: Joi.string(),
    user_photo: Joi.string().default("/user/avatar.jpg"),
    created_date: Joi.date(),
    updated_date: Joi.date(),
    user_is_active: Joi.boolean().default("false"),
  });

  return schema.validate(data, { abortEarly: false });
};

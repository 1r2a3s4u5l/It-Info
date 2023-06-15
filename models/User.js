const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      trim: true,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    user_info: {
      type: String,
    },
    user_photo: {
      type: String,
    },
    user_is_active: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
  }
);
module.exports = model("User", userSchema);

const User = require("../models/User");
const bcrypt = require("bcrypt");
const myJwt = require("../services/JwtServices");
const config = require("config");
const emailValidation = require("../helpers/emailValidation");
const ApiError = require("../error/ApiError");

const uuid = require("uuid");
const mailService = require("../services/Mail.service");

const addUser = async (req, res) => {
  try {
    const { user_name, user_email, user_password, user_info, user_photo } =
      req.body;
    const userHashedPassword = bcrypt.hashSync(user_password, 7);
    const user_activation_link = uuid.v4();
    const userFound = await User.findOne({ user_email });
    if (userFound) {
      return res.status(400).send({ friendlyMsg: "user exists" });
    }
    const newUser = User({
      user_name,
      user_email,
      user_password: userHashedPassword,
      user_info,
      user_photo,
      user_activation_link
    });
    await mailService.sendActivationMail(
      user_email,
      `${config.get("api_url")}/api/user/activate/${user_activation_link}`
    );
    const payload = {
      id: newUser._id,
      userRoles: ["READ", "WRITE"],
      user_is_active: newUser.user_is_active,
    };
    const tokens = myJwt.generateTokens(payload);
    newUser.user_token = tokens.refreshToken;
    await newUser.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.status(200).json({ ...tokens, user: payload });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await User.find({});
    if (!data.length)
      return res.error(400, { friendlyMsg: "Information not found" });
    res.send(data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData)
      return res.error(400, { friendlyMsg: "Information is not found" });
    res.status(200).send(idData);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData)
      return res.error(400, { friendlyMsg: "Information was not found" });
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_reg_date,
    } = req.body;
    const userHashedPassword = bcrypt.hashSync(user_password, 7);
    const data = await User.findByIdAndUpdate(
      { _id: id },
      {
        user_name,
        user_email,
        user_password: userHashedPassword,
        user_info,
        user_photo,
        user_reg_date,
      }
    );
    await data.save();
    res.ok(200, "OK.Info was updated");
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idData = await User.findById(id);
    if (!idData)
      return res.error(400, { friendlyMsg: "Information was not found" });
    await User.findByIdAndDelete(id);
    if (req.user.id !== req.params.id) {
      ApiError.unuserized(res, {
        friendlyMsg: "User ro'yxatga olinmagan",
      });
    }
    res.ok(200, { friendlyMsg: "Ok. userInfo is deleted" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};

const loginUser = async (req, res) => {
  let user;
  const { login, user_password } = req.body;
  if (emailValidation(login)) user = await User.findOne({ user_email: login });
  else user = await User.findOne({ user_name: login });
  if (!user) return res.error(400, { friendlyMsg: "Malumotlar notogri" });
  const validPassword = bcrypt.compareSync(user_password, user.user_password);
  if (!validPassword)
    return res.error(400, { friendlyMsg: "Malumotlaringiz notogri" });
  const payload = {
    id: user.id,
  };
  const tokens = myJwt.generateTokens(payload);
  user.user_token = tokens.refreshToken;
  await user.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.ok(200, tokens);
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let user;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    user = await User.findOneAndUpdate(
      { user_token: refreshToken },
      { user_token: "" },
      { new: true }
    );
    if (!user) return res.error(400, { friendlyMsg: "Token topilmadi" });
    res.clearCookie("refreshToken");
    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda hatolik",
    });
  }
};
const userActivate = async (req, res) => {
  try {
    const user = await User.findOne({
      user_activation_link: req.params.link,
    });
    if (!user) {
      return res.status(400).send({ message: "Bunday user topilmadi" });
    }
    if (user.user_is_active) {
      return res.status(400).send({ message: "User already activated" });
    }
    user.user_is_active = true;
    await user.save();
    res.status(200).send({
      user_is_active: user.user_is_active,
      message: "user actived",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  userActivate,
};

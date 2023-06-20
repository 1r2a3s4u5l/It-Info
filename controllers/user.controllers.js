const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../services/JwtServices");
const config = require("config");
const emailValidation = require("../helpers/emailValidation");
const ApiError = require("../error/ApiError");

const addUser = async (req, res) => {
  try {
    const { user_name, user_email, user_password, user_info, user_photo } =
      req.body;
    const userHashedPassword = bcrypt.hashSync(user_password, 7);
    const userFound = await User.findOne({ user_email });
    if (!userFound) {
      return res.error(400, { friendlyMsg: "email is not found" });
    }
    const data = User({
      user_name,
      user_email,
      user_password: userHashedPassword,
      user_info,
      user_photo,
    });
    // console.log(data);
    const payload = {
      id: data._id,
      email: data.user_email,
      userRoles: ["READ", "WRITE"],
    };
    const tokens = jwt.generateTokens(payload);
    data.user_token = tokens.refreshToken;
    // console.log(1);
    await data.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    // res.ok(200, { ...tokens, user: payload });
    res.status(200).send({ ...tokens });
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
      ApiError.unauthorized(res, {
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
  const tokens = jwt.generateTokens(payload);
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
module.exports = {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
};

const errorHandler = require("../helpers/error_handler");
const bcryp = require("bcrypt");
const User = require("../models/User");
const { userValidation } = require("../validations/user.validation");

const createUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      created_date,
      updated_date,
      user_is_active,
    } = value;
    console.log(value);
    const user = await User.findOne({ user_email });
    if (user) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcryp.hash(user_password, 7);
    const newUser = new User({
      user_name,
      user_email,
      user_password: hashedPassword,
      user_info,
      user_photo,
      created_date,
      updated_date,
      user_is_active,
    });
    newUser.save();

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await User.findOne({ user_email });
    if (!user)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
    const validPassword = bcryp.compareSync(user_password, user.user_password);
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });

    res.status(200).send({ message: "Tizimga hush kelibsiz!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const categories = await User.find({});
    if (!categories) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        message: "Invalid  id",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  createUser,
  getUsers,
  getUserById,
  loginUser,
};

const errorHandler = require("../helpers/error_handler");
const Author = require("../models/Author");
const { authorValidation } = require("../validations/author.validation");
const bcryp = require("bcrypt");
const config = require("config");
const { default: mongoose } = require("mongoose");
const myJwt = require("../services/JwtServices");

const uuid = require("uuid");
const mailService = require("../services/Mail.service");

const createAuthor = async (req, res) => {
  try {
    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_password,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = req.body;
    const author = await Author.findOne({ author_email });
    if (author) {
      return res.status(400).send({ message: "Author already exists" });
    }

    const hashedPassword = await bcryp.hash(author_password, 7);

    const author_activation_link = uuid.v4();

    const newAuthor = new Author({
      author_first_name,
      author_last_name,
      author_nick_name,
      author_password: hashedPassword,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
      author_activation_link,
    });
    await newAuthor.save();

    console.log(1);
    await mailService.sendActivationMail(
      author_email,
      `${config.get("api_url")}/api/author/activate/${author_activation_link}`
    );
    const payload = {
      id: newAuthor._id,
      is_expert: newAuthor.is_expert,
      authorRoles: ["READ", "WRITE"],
      author_is_active: newAuthor.author_is_active,
    };
    const tokens = myJwt.generateTokens(payload);
    newAuthor.author_token = tokens.refreshToken;
    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.status(200).json({ ...tokens, author: payload });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { author_email, author_password } = req.body;
    const author = await Author.findOne({ author_email });
    if (!author)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
    const validPassword = bcryp.compareSync(
      author_password,
      author.author_password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });

    const payload = {
      id: author._id,
      is_expert: author.is_expert,
      authorRoles: ["READ", "WRITE"],
    };
    const tokens = myJwt.generateTokens(payload);
    // res.status(200).send({ tokens: tokens });
    console.log(tokens);
    // const token = generateAcccessToken(author._id, author.is_expert, [
    //   "READ",
    //   "WRITE",
    // ]);

    author.author_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send({ ...tokens });
  } catch (error) {
    // errorHandler(res, error);
    console.log(error);
  }
};
const logoutAuthor = async (req, res) => {
  const { refreshToken } = req.cookies;
  let author;
  if (!refreshToken)
    return res.status(400).send({ message: "Token topilmadi" });
  author = await Author.findOneAndUpdate(
    { author_token: refreshToken },
    { author_token: "" },
    { new: true }
  );
  if (!author) return res.status(400).send({ message: "Token topilmadi" });

  res.clearCookie("refreshToken");
  res.status(200).send({ author });
};
const getAuthors = async (req, res) => {
  try {
    const categories = await Author.find({});
    if (!categories) {
      return res.status(404).json({ message: "No author found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        message: "Invalid  id",
      });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: "No author found" });
    }
    res.status(200).json(author);
  } catch (error) {
    errorHandler(res, error);
  }
};
const refreshAuthorToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(400).send({ message: "Token topilmadi" });
  const authorDataFromCookies = await myJwt.verifyRefresh(refreshToken);

  const authorDataFromDB = await Author.findOne({ author_token: refreshToken });
  if (!authorDataFromCookies || !authorDataFromDB) {
    return res.status(400).send({ message: "Author ro'yhatdan o'tmagan" });
  }
  const author = await Author.findById(authorDataFromCookies.id);
  if (!author) return res.status(400).send({ message: "Id noto'g'ri" });

  const payload = {
    id: author._id,
    is_expert: author.is_expert,
    authorRoles: ["READ", "WRITE"],
  };
  const tokens = myJwt.generateTokens(payload);
  author.author_token = tokens.refreshToken;
  await author.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.status(200).send({ ...tokens });
};
const authorActivate = async (req, res) => {
  try {
    const author = await Author.findOne({
      author_activation_link: req.params.link,
    });
    if (!author) {
      return res.status(400).send({ message: "Bunday avtor topilmadi" });
    }
    if (author.author_is_active) {
      return res.status(400).send({ message: "User already activated" });
    }
    author.author_is_active = true;
    await author.save();
    res.status(200).send({
      author_is_active: author.author_is_active,
      message: "user actived",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  createAuthor,
  getAuthors,
  getAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
};

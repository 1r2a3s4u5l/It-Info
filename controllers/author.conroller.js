const errorHandler = require("../helpers/error_handler");
const Author = require("../models/Author");
const { authorValidation } = require("../validations/author.validation");
const jwt = require("jsonwebtoken");
const bcryp = require("bcrypt");
const config = require("config");
const { default: mongoose } = require("mongoose");

const generateAcccessToken = (id, is_expert, authorRoles) => {
  const payload = {
    id,
    is_expert,
    authorRoles,
  };
  return jwt.sign(payload, config.get("secret"), { expiresIn: "1h" });
};

const createAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
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
    } = value;
    const author = await Author.findOne({ author_email });
    if (author) {
      return res.status(400).send({ message: "Author already exists" });
    }

    const hashedPassword = await bcryp.hash(author_password, 7);
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
    });
    newAuthor.save();

    res.status(201).json({ message: "Author added successfully" });
  } catch (error) {
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

    const token = generateAcccessToken(author._id, author.is_expert, [
      "READ",
      "WRITE",
    ]);

    res.status(200).send({ token: token });
  } catch (error) {
    errorHandler(res, error);
  }
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
module.exports = {
  createAuthor,
  getAuthors,
  getAuthorById,
  loginAuthor,
};

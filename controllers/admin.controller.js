const errorHandler = require("../helpers/error_handler");
const bcryp = require("bcrypt");
const Admin = require("../models/Admin");
const { adminValidation } = require("../validations/admin.validation");

const createAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
      created_date,
      updated_date,
    } = value;
    console.log(value);
    const admin = await Admin.findOne({ admin_email });
    if (admin) {
      return res.status(400).send({ message: "Admin already exists" });
    }

    const hashedPassword = await bcryp.hash(admin_password, 7);
    const newAdmin = new Admin({
      admin_name,
      admin_email,
      admin_password: hashedPassword,
      admin_is_active,
      admin_is_creator,
      created_date,
      updated_date,
    });
    newAdmin.save();

    res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;
    const admin = await Admin.findOne({ admin_email });
    if (!admin)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
    const validPassword = bcryp.compareSync(
      admin_password,
      admin.admin_password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });

    res.status(200).send({ message: "Tizimga hush kelibsiz!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmins = async (req, res) => {
  try {
    const categories = await Admin.find({});
    if (!categories) {
      return res.status(404).json({ message: "No admin found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        message: "Invalid  id",
      });
    }
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "No admin found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  createAdmin,
  getAdmins,
  getAdminById,
  loginAdmin,
};

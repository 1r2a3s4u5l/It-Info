const { Router } = require("express");
const {
  getAdmins,
  createAdmin,
  getAdminById,
  loginAdmin,
} = require("../controllers/admin.controller");

const router = Router();
router.get("/", getAdmins);
router.post("/", createAdmin);
router.get("/:id", getAdminById);
router.post("/login", loginAdmin);

module.exports = router;

const { Router } = require("express");
const {
  getAdmins,
  addAdmin,
  loginAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  logoutAdmin,
} = require("../controllers/admin.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getAdmins);
router.post("/", addAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/:id", getAdmin);
router.put("/:id", adminPolice, updateAdmin);
router.delete("/:id", adminPolice, deleteAdmin);

module.exports = router;

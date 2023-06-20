const { Router } = require("express");
const {
  getUsers,
  addUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  logoutUser,
} = require("../controllers/user.controllers");
const Validator = require("../middleware/validator");
const router = Router();
const userPolice = require("../middleware/userPolice");

router.get("/", getUsers);
router.post("/", Validator("user"), addUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/:id", getUser);
router.put("/:id", userPolice, updateUser);
router.delete("/:id", userPolice, deleteUser);

module.exports = router;

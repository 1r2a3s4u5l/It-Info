const { Router } = require("express");
const { getUsers, createUser, getUserById, loginUser } = require("../controllers/user.controllers");


const router = Router();
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.post("/login", loginUser);


module.exports = router;

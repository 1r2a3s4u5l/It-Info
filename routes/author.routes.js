const { Router } = require("express");
const {
  getAuthors,
  createAuthor,
  getAuthorById,
  loginAuthor,
} = require("../controllers/author.conroller");
const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");
const router = Router();

router.get("/", authorPolice, getAuthors);
router.post("/", createAuthor);
router.get(
  "/:id",
  authorRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  getAuthorById
);
router.post("/login", loginAuthor);

module.exports = router;

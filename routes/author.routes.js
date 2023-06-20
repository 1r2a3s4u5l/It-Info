const { Router } = require("express");
const {
  getAuthors,
  createAuthor,
  getAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
} = require("../controllers/author.conroller");
const Validator = require("../middleware/validator");
const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");
const router = Router();

router.get("/", authorPolice, getAuthors);
router.get(
  "/:id",
  authorRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  getAuthorById
);
router.post("/add", Validator("author"), createAuthor);
router.post("/login", Validator("author_email_pass"), loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
router.get("/activate/:link", authorActivate);

module.exports = router;

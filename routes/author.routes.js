const { Router } = require("express");
const {
  getAuthors,
  createAuthor,
  getAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
  deleteAuthor,
} = require("../controllers/author.conroller");
const Validator = require("../middleware/validator");
const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");
const router = Router();

router.get("/", authorPolice, getAuthors);
router.get(
  "/:id",
  authorPolice,
  // authorRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  getAuthorById
);
router.post("/add", Validator("author"), createAuthor);
router.post("/login", Validator("author_email_pass"), loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
router.get("/activate/:link", authorActivate);
router.delete("/delete/:id", authorPolice, deleteAuthor);
// router.put("/update/:id", authorPolice, updateAuthor);

module.exports = router;

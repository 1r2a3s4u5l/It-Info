const { Router } = require("express");

const { createViewPath } = require("../helpers/createViewPath");

const router = Router();

router.get("/", (req, res) => {
  res.render(createViewPath("index"),
  {
    title: "Asosiy sahifa",
    isHome: true,
  })
});

router.get("/dictionary", (req, res) => {
  res.render(createViewPath("dictionary"), {
    title: "Lug'atlar",
    isDict: true,
  });
});
router.get("/topics", (req, res) => {
  res.render(createViewPath("topics"), {
    title: "Maqolalar",
    isTopic: true,
  });
});
router.get("/authors", (req, res) => {
  res.render(createViewPath("authors"), {
    title: "Mualliflar",
    isAuthor: true,
  });
});
router.get("/login", (req, res) => {
  res.render(createViewPath("login"), {
    title: "Login",
    isLogin: true,
  });
});

module.exports = router;

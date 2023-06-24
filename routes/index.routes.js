const { Router } = require("express");
const express = require("express");
const router = Router();

express.Router.prefix = function (path, subRouter) {
  const router = express.Router();
  this.use(path, router);
  subRouter(router);
  return router;
};

const dictRouter = require("./dictionary.routes");
const categoryRouter = require("./category.routes");
const descRouter = require("./describe.routes");
const synonymRouter = require("./synonym.routes");
const authorRouter = require("./author.routes");
const userRouter = require("./user.routes");
const adminRouter = require("./admin.routes");
const viewRouter = require("./view.routes");

router.use("/",viewRouter)

router.use("/api/dictionary", dictRouter);
router.use("/api/category", categoryRouter);
router.use("/api/description", descRouter);
router.use("/api/synonym", synonymRouter);
router.use("/api/author", authorRouter);
router.use("/api/user", userRouter);
router.use("/api/admin", adminRouter);

module.exports = router;

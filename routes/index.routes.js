const { Router } = require("express");
const router = Router();

const dictRouter = require("./dictionary.routes");
const categoryRouter = require("./category.routes");
const descRouter = require("./describe.routes");
const synonymRouter = require("./synonym.routes");
const authorRouter = require("./author.routes");
const userRouter = require("./user.routes");
const adminRouter = require("./admin.routes");

router.use("/api/dictionary", dictRouter);
router.use("/api/category", categoryRouter);
router.use("/api/description", descRouter);
router.use("/api/synonym", synonymRouter);
router.use("/api/author", authorRouter);
router.use("/api/user", userRouter);
router.use("/api/admin", adminRouter);

module.exports = router;

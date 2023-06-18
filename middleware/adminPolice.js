const MyJwt = require("../services/JwtServices");

module.exports = async function (req, res, next) {
  if (req.method == "OPTIONS") {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "Admin ro'yhatdan o'tmagan" });
    }
    console.log(authorization);
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "Admin ro'yhatdan o'tmagan(token berilmagan)" });
    }

    const [error, resdecodedToken] = await to(MyJwt.verifyAccess(token));
    if (error) {
      return res.status(403).json({ message: error.message });
    }

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Admin royhatdan o'tmagan(token noto'g'ri)" });
  }
};

async function to(promise) {
  return promise.then((response) => [null, response]).catch((error) => [error]);
}

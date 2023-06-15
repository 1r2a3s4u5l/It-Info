const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method == "OPTIONS") {
      next();
    }
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(403).json({ message: "Avtor ro'yhatdan o'tmagan" });
      }
      console.log(authorization);
      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];
      if (bearer != "Bearer" || !token) {
        return res
          .status(403)
          .json({ message: "Avtor ro'yhatdan o'tmagan(token berilmagan)" });
      }

      const decodedToken = jwt.verify(token, config.get("secret"));

      const { is_expert, authorRoles } = jwt.verify(
        token,
        config.get("secret")
      );
      let hasRole = false;
      authorRoles.forEach((authorRole) => {
        if (roles.includes(authorRole)) hasRole = true;
      });

      if (!is_expert || !hasRole) {
        return res
          .status(403)
          .json({ message: "Sizda bunday huquq berilmagan" });
      }

      next();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Avtor ro'yhatdan o'tmagan(token noto'g'ri)" });
    }
  };
};

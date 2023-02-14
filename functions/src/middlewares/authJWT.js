const { jwtVerifyToken } = require("../utils/jwtHelper");

const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) return res.sendStatus(401);

    const token = req.headers["authorization"].replace("Bearer ", "");

    jwtVerifyToken(token);

    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

module.exports = jwtValidate;

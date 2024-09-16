const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const userService = require("../api/users/users.service")

module.exports = async (req, res, next) => {
  try {
    //console.log("req -> ", req );
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    req.user = decoded;
    const userConnected = await userService.get(req.user.userId)
    req.user = userConnected
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};

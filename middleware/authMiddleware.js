const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken;
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;

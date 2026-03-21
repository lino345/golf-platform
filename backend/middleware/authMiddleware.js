
const jwt = require("jsonwebtoken");

const SECRET = "supersecretkey";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

module.exports = auth;
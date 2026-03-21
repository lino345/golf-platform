const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

const SECRET = "supersecretkey";

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    email,
    password: hashed,
  };

  global.users.push(user);

  res.json({ message: "User created" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = global.users.find(u => u.email === email);
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user.id }, SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

module.exports = router;
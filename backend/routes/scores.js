const express = require("express");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ADD SCORE
router.post("/add", auth, (req, res) => {
  const userId = req.user.id;
  const { score } = req.body;

  if (!global.scores[userId]) global.scores[userId] = [];

  global.scores[userId].push(score);

  if (global.scores[userId].length > 5) {
    global.scores[userId].shift();
  }

  res.json(global.scores[userId]);
});

// GET SCORES
router.get("/", auth, (req, res) => {
  const userId = req.user.id;
  res.json(global.scores[userId] || []);
});

module.exports = router;
const express = require("express");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

function generateDraw() {
  let nums = new Set();
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return [...nums];
}

router.post("/run", auth, (req, res) => {
  global.draw = generateDraw();

  let results = [];

  for (let userId in global.scores) {
    const userScores = global.scores[userId];

    const matches = userScores.filter(s =>
      global.draw.includes(s)
    ).length;

    results.push({ userId, matches });
  }

  res.json({ draw: global.draw, results });
});

module.exports = router;
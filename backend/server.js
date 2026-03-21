global.users = [];
global.scores = {};
global.subscriptions = {};
global.draw = [];
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/scores");
const drawRoutes = require("./routes/draw");
console.log("authRoutes:", authRoutes);
console.log("scoreRoutes:", scoreRoutes);
console.log("drawRoutes:", drawRoutes);

const app = express();
app.use(cors());

app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/scores", scoreRoutes);
app.use("/draw", drawRoutes);

app.listen(5000, () => console.log("Server running 🚀"));
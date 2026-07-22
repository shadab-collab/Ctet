const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ======================
// Middleware
// ======================

app.use(cors());
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// ======================
// MongoDB
// ======================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// ======================
// API Routes
// ======================

app.use("/api/results", require("./routes/results"));
app.use("/api/questions", require("./routes/questions"));

// ======================
// Home Page
// ======================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Question Setter Page
// ======================

app.get("/set-question", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "set-question.html"));
});

// ======================
// 404
// ======================

app.use((req, res) => {
  res.status(404).send("404 Page Not Found");
});

// ======================
// Server
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
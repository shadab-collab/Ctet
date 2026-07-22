const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// HTML, CSS, JS सर्व करें
app.use(express.static(__dirname));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// API
app.use("/api/results", require("./routes/results"));

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Render PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Running on Port " + PORT);
});
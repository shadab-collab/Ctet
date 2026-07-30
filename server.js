const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => {
    console.log("MongoDB Connection Error:", err);
  });

// Base Route
app.get("/", (req, res) => {
  res.send("CTET Quiz Server Running");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});

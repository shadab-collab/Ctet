const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/results", require("./routes/results"));

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server Running on Port " + PORT);
});
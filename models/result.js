const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },
  
  score: {
    type: Number,
    required: true
  },
  
  total: {
    type: Number,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model("Result", ResultSchema);
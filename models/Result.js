const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  
  studentName: {
    type: String,
    required: true
  },
  
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },
  
  score: {
    type: Number,
    default: 0
  },
  
  total: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model("Result", resultSchema);
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  
  quizId: {
    type: String,
    required: true,
    unique: true
  },
  
  quizName: {
    type: String,
    required: true,
    trim: true
  },
  
  quizDate: {
    type: String,
    required: true
  },
  
  topic: {
    type: String,
    default: ""
  },
  
  isLive: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model("Quiz", quizSchema);
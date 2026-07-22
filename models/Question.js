const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  hi: {
    type: String,
    required: true
  },
  en: {
    type: String,
    required: true
  }
});

const questionSchema = new mongoose.Schema({
  
  quizTitle: {
    type: String,
    default: "CTET Live Quiz"
  },
  
  quizDate: {
    type: String,
    required: true
  },
  
  questionHindi: {
    type: String,
    required: true
  },
  
  questionEnglish: {
    type: String,
    required: true
  },
  
  options: {
    type: [optionSchema],
    validate: v => v.length === 4
  },
  
  answer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  
  published: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model("Question", questionSchema);
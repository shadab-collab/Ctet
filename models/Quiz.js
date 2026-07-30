const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  hi: String,
  en: String
}, { _id: false });

const questionSchema = new mongoose.Schema({
  questionHindi: String,
  questionEnglish: String,
  options: [optionSchema],
  answer: Number
}, { _id: false });

const quizSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true
  },
  
  topic: {
    type: String,
    default: ""
  },
  
  questions: {
    type: [questionSchema],
    default: []
  },
  
  archived: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model("Quiz", quizSchema);
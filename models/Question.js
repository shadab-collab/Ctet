const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    hi: {
      type: String,
      required: true,
      trim: true
    },
    en: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    trim: true
  },

  quizTitle: {
    type: String,
    default: "CTET Live Quiz",
    trim: true
  },

  quizDate: {
    type: String,
    required: true,
    trim: true
  },

  questionHindi: {
    type: String,
    required: true,
    trim: true
  },

  questionEnglish: {
    type: String,
    required: true,
    trim: true
  },

  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length === 4,
      message: "Question must have exactly 4 options."
    }
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Question", questionSchema);
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    quizName: {
      type: String,
      required: true,
      trim: true
    },

    quizDate: {
      type: String,
      required: true,
      trim: true
    },

    topic: {
      type: String,
      default: "",
      trim: true
    },

    isLive: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
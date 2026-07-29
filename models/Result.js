const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    score: {
      type: Number,
      required: true,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Result", resultSchema);
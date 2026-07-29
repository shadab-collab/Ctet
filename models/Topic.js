const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Today's Quiz",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Topic", topicSchema);
const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  
  title: {
    
    type: String,
    
    required: true,
    
    default: "Today's Quiz"
    
  },
  
  updatedAt: {
    
    type: Date,
    
    default: Date.now
    
  }
  
});

module.exports = mongoose.model("Topic", TopicSchema);
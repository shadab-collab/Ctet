const express = require("express");
const router = express.Router();

const Topic = require("../models/Topic");

// ============================
// GET TODAY'S TOPIC
// ============================

router.get("/", async (req, res) => {
  try {
    
    let topic = await Topic.findOne();
    
    if (!topic) {
      topic = await Topic.create({
        title: "Today's Quiz"
      });
    }
    
    res.json(topic);
    
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
});

// ============================
// UPDATE TOPIC
// ============================

router.put("/", async (req, res) => {
  try {
    
    let topic = await Topic.findOne();
    
    if (!topic) {
      
      topic = await Topic.create({
        title: req.body.title
      });
      
    } else {
      
      topic.title = req.body.title;
      await topic.save();
      
    }
    
    res.json({
      success: true,
      message: "Topic Updated Successfully"
    });
    
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
});

module.exports = router;
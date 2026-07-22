const express = require("express");
const router = express.Router();

const Result = require("../models/Result");


// ===============================
// Save Result
// ===============================

router.post("/", async (req, res) => {
  
  try {
    
    const result = new Result({
      
      name: req.body.name,
      
      score: req.body.score,
      
      total: req.body.total
      
    });
    
    await result.save();
    
    res.json({
      
      success: true,
      
      message: "Result Saved"
      
    });
    
  } catch (err) {
    
    res.status(500).json({
      
      success: false,
      
      error: err.message
      
    });
    
  }
  
});


// ===============================
// Leaderboard
// ===============================

router.get("/", async (req, res) => {
  
  try {
    
    const results = await Result.find()
      
      .sort({ score: -1, createdAt: 1 })
      
      .limit(20);
    
    res.json(results);
    
  } catch (err) {
    
    res.status(500).json({
      
      success: false,
      
      error: err.message
      
    });
    
  }
  
});

module.exports = router;
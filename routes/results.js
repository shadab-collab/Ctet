const express = require("express");
const router = express.Router();

const Result = require("../models/Result");

// ============================
// SAVE RESULT
// POST /api/results
// ============================

router.post("/", async (req, res) => {
  
  try {
    
    const result = new Result(req.body);
    
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

// ============================
// GET LEADERBOARD
// GET /api/results
// ============================

router.get("/", async (req, res) => {
  
  try {
    
    const results = await Result.find()
      .sort({ score: -1, createdAt: 1 });
    
    res.json(results);
    
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});

// ============================
// RESET ALL RESULTS
// DELETE /api/results/reset
// ============================

router.delete("/reset", async (req, res) => {
  
  try {
    
    await Result.deleteMany({});
    
    res.json({
      success: true,
      message: "Leaderboard Reset Successfully"
    });
    
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});

module.exports = router;
const express = require("express");
const router = express.Router();

const Result = require("../models/Result");

// ============================
// SAVE RESULT
// POST /api/results
// ============================

router.post("/", async (req, res) => {
  try {
    
    const result = await Result.create(req.body);
    
    res.json({
      success: true,
      message: "Result Saved",
      data: result
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
// GET /api/results?quizId=123
// ============================

router.get("/", async (req, res) => {
  try {
    
    const filter = {};
    
    if (req.query.quizId) {
      filter.quizId = req.query.quizId;
    }
    
    const results = await Result.find(filter).sort({
      score: -1,
      createdAt: 1
    });
    
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
    
    if (req.query.quizId) {
      
      await Result.deleteMany({
        quizId: req.query.quizId
      });
      
    } else {
      
      await Result.deleteMany({});
      
    }
    
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
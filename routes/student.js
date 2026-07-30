const express = require("express");
const router = express.Router();

const Quiz = require("../models/Quiz");
const Result = require("../models/Result");


// Student के लिए Latest Active Quiz
router.get("/quiz", async (req, res) => {
  
  const quiz = await Quiz.findOne({
    archived: false
  }).sort({
    createdAt: -1
  });
  
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "No Active Quiz"
    });
  }
  
  res.json(quiz);
  
});


// Result Save
router.post("/result", async (req, res) => {
  
  try {
    
    const result = new Result({
      studentName: req.body.studentName,
      quizId: req.body.quizId,
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
      message: err.message
    });
    
  }
  
});


// Leaderboard
router.get("/leaderboard", async (req, res) => {
  
  const data = await Result.find()
    .sort({
      score: -1,
      createdAt: 1
    });
  
  res.json(data);
  
});

module.exports = router;
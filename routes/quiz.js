const express = require("express");

const router = express.Router();

const Quiz = require("../models/Quiz");

// ===========================
// GET ALL QUIZZES
// ===========================

router.get("/", async (req, res) => {
  
  try {
    
    const quizzes = await Quiz.find()
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
    
  }
  
  catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});

// ===========================
// CREATE QUIZ
// ===========================

router.post("/", async (req, res) => {
  
  try {
    
    const quiz = new Quiz(req.body);
    
    await quiz.save();
    
    res.json({
      success: true,
      message: "Quiz Created Successfully"
    });
    
  }
  
  catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});

// ===========================
// DELETE QUIZ
// ===========================

router.delete("/:id", async (req, res) => {
  
  try {
    
    await Quiz.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true
    });
    
  }
  
  catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});

module.exports = router;
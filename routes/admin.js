const express = require("express");
const router = express.Router();

const Quiz = require("../models/Quiz");
const Result = require("../models/Result");


// नया Quiz Save
router.post("/quiz", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    
    res.json({
      success: true,
      message: "Quiz Saved"
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// Active Quiz
router.get("/quiz", async (req, res) => {
  
  const quizzes = await Quiz.find({ archived: false })
    .sort({ createdAt: -1 });
  
  res.json(quizzes);
  
});


// Archive Quiz
router.put("/archive/:id", async (req, res) => {
  
  await Quiz.findByIdAndUpdate(req.params.id, {
    archived: true
  });
  
  res.json({
    success: true
  });
  
});


// Archive List
router.get("/archive", async (req, res) => {
  
  const quizzes = await Quiz.find({
    archived: true
  }).sort({ createdAt: -1 });
  
  res.json(quizzes);
  
});


// Reuse Quiz
router.put("/reuse/:id", async (req, res) => {
  
  await Quiz.findByIdAndUpdate(req.params.id, {
    archived: false
  });
  
  res.json({
    success: true
  });
  
});


// Delete Quiz
router.delete("/quiz/:id", async (req, res) => {
  
  await Quiz.findByIdAndDelete(req.params.id);
  
  res.json({
    success: true
  });
  
});


// Leaderboard
router.get("/leaderboard", async (req, res) => {
  
  const data = await Result.find()
    .sort({ score: -1, createdAt: 1 });
  
  res.json(data);
  
});


// Reset Leaderboard
router.delete("/leaderboard/reset", async (req, res) => {
  
  await Result.deleteMany({});
  
  res.json({
    success: true
  });
  
});

module.exports = router;
const express = require("express");
const router = express.Router();

const Question = require("../models/Question");


// ============================
// आज के प्रश्न प्राप्त करें
// GET /api/questions
// ============================

router.get("/", async (req, res) => {
  
  try {
    
    const today = new Date().toISOString().slice(0, 10);
    
    const questions = await Question.find({
      quizDate: today,
      published: true
    }).sort({ createdAt: 1 });
    
    res.json(questions);
    
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    });
    
  }
  
});


// ============================
// नया प्रश्न जोड़ें
// POST /api/questions
// ============================

router.post("/", async (req, res) => {
  
  try {
    
    const question = new Question(req.body);
    
    await question.save();
    
    res.json({
      success: true,
      message: "Question Saved"
    });
    
  } catch (err) {
    
    res.status(400).json({
      success: false,
      error: err.message
    });
    
  }
  
});


// ============================
// प्रश्न हटाएँ
// DELETE /api/questions/:id
// ============================

router.delete("/:id", async (req, res) => {
  
  try {
    
    await Question.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true
    });
    
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});


// ============================
// प्रश्न अपडेट करें
// PUT /api/questions/:id
// ============================

router.put("/:id", async (req, res) => {
  
  try {
    
    await Question.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    
    res.json({
      success: true
    });
    
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});
// ============================
// QUIZ ARCHIVE (DATES)
// GET /api/questions/archive
// ============================

router.get("/archive", async (req, res) => {
  
  try {
    
    const dates = await Question.distinct("quizDate");
    
    dates.sort((a, b) => b.localeCompare(a));
    
    const result = [];
    
    for (const date of dates) {
      
      const count = await Question.countDocuments({
        quizDate: date
      });
      
      result.push({
        quizDate: date,
        totalQuestions: count
      });
      
    }
    
    res.json(result);
    
  }
  
  catch (err) {
    
    res.status(500).json({
      success: false,
      error: err.message
    });
    
  }
  
});


// ============================
// QUESTIONS BY DATE
// GET /api/questions/archive/:date
// ============================

router.get("/archive/:date", async (req, res) => {
  
  try {
    
    const questions = await Question.find({
      
      quizDate: req.params.date
      
    }).sort({
      
      createdAt: 1
      
    });
    
    res.json(questions);
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      success: false,
      
      error: err.message
      
    });
    
  }
  
});

module.exports = router;
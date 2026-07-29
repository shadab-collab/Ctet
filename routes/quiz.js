const express = require("express");
const router = express.Router();

const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// ===========================
// GET ALL QUIZZES
// ===========================

router.get("/", async (req, res) => {
  
  try {
    
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    const result = [];

    for (const quiz of quizzes) {

      const count = await Question.countDocuments({

        quizId: quiz.quizId

      });

      result.push({

        ...quiz.toObject(),

        questionCount: count

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

// ===========================
// CREATE QUIZ
// ===========================

router.post("/", async (req, res) => {
  
  try {
    
    const exists = await Quiz.findOne({
      
      quizDate: req.body.quizDate,
      
      quizName: req.body.quizName
      
    });
    
    if (exists) {
      
      return res.json({
        
        success: false,
        
        error: "Same Quiz Name Already Exists"
        
      });
      
    }
    
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
// MAKE LIVE QUIZ
// ===========================

router.put("/live/:quizId", async (req, res) => {
  
  try {
    
    await Quiz.updateMany({}, {
      
      isLive: false
      
    });
    
    await Quiz.findOneAndUpdate({
      
      quizId: req.params.quizId
      
    }, {
      
      isLive: true
      
    });
    
    res.json({
      
      success: true,
      
      message: "Live Quiz Updated"
      
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
// MERGE QUIZ
// ===========================

router.post("/merge", async (req, res) => {
  
  try {
    
    const {
      
      quizIds,
      
      quizName
      
    } = req.body;
    
    const newQuizId = Date.now().toString();
    
    await Quiz.create({
      
      quizId: newQuizId,
      
      quizName,
      
      quizDate: new Date()
        
        .toISOString()
        
        .slice(0, 10),
      
      isLive: false
      
    });
    
    const questions = await Question.find({
      
      quizId: {
        
        $in: quizIds
        
      }
      
    });
    
    for (const q of questions) {

      const obj = q.toObject();
      
      delete obj._id;
      
      obj.quizId = newQuizId;
      
      await Question.create(obj);
      
    }
    
    res.json({
      
      success: true,
      
      message: questions.length + " Questions Merged"
      
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
    
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      
      return res.json({
        
        success: false,
        
        error: "Quiz Not Found"
        
      });
      
    }
    
    await Question.deleteMany({
      
      quizId: quiz.quizId
      
    });
    
    await Quiz.findByIdAndDelete(req.params.id);
    
    res.json({
      
      success: true,
      
      message: "Quiz Deleted"
      
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
// RENAME QUIZ
// ===========================

router.put("/:id", async (req, res) => {
  
  try {
    
    await Quiz.findByIdAndUpdate(
      
      req.params.id,
      
      {
        
        quizName: req.body.quizName
        
      }
      
    );
    
    res.json({
      
      success: true,
      
      message: "Quiz Renamed"
      
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

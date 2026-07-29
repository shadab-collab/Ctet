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
// MAKE LIVE QUIZ
// ===========================

router.put("/live/:quizId", async (req, res) => {

    try {

        await Quiz.updateMany(
            {},
            {
                isLive: false
            }
        );

        await Quiz.findOneAndUpdate(
            {
                quizId: req.params.quizId
            },
            {
                isLive: true
            }
        );

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

const Question = require("../models/Question");

router.post("/merge", async (req, res) => {
  
  try {
    
    const {
      
      quizIds,
      
      quizName
      
    } = req.body;
    
    const newQuizId =
      
      Date.now().toString();
    
    await Quiz.create({
      
      quizId: newQuizId,
      
      quizName,
      
      quizDate: new Date()
        
        .toISOString()
        
        .slice(0, 10)
      
    });
    
    const questions =
      
      await Question.find({
        
        quizId: {
          
          $in: quizIds
          
        }
        
      });
    
    for (const q of questions) {
      
      const obj = q.toObject();
      
      delete obj._id;
      
      obj.quizId = newQuizId;
      
      obj.quizName = quizName;
      
      await Question.create(obj);
      
    }
    
    res.json({
      
      success: true,
      
      message: "Combined Quiz Created"
      
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

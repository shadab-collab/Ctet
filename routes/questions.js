const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// ============================
// QUIZ ID के आधार पर प्रश्न प्राप्त करें
// GET /api/questions?quizId=123
// ============================

router.get("/", async (req, res) => {
  try {
    const { quizId } = req.query;
    
    if (!quizId) {
      return res.json([]);
    }
    
    const questions = await Question.find({
      quizId,
      published: true
    }).sort({ createdAt: 1 });
    
    res.json(questions);
    
  } catch (err) {
    res.status(500).json({
      success: false,
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
    await Question.create(req.body);
    
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
// GET QUESTIONS BY QUIZ (NEW)
// /api/questions/reuse/:quizId
// ============================

router.get("/reuse/:quizId", async (req, res) => {
  try {
    const questions = await Question.find({
      quizId: req.params.quizId
    });

    res.json({
      success: true,
      questions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================
// COPY QUESTIONS (NEW)
// /api/questions/reuse
// ============================

router.post("/reuse", async (req, res) => {
  try {
    const { sourceQuizId, targetQuizId } = req.body;

    const questions = await Question.find({
      quizId: sourceQuizId
    });

    let count = 0;

    for (const q of questions) {
      const obj = q.toObject();

      delete obj._id;
      delete obj.createdAt;
      delete obj.updatedAt;

      obj.quizId = targetQuizId;

      await Question.create(obj);
      count++;
    }

    res.json({
      success: true,
      message: count + " Questions Copied"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================
// LIVE QUESTIONS
// GET /api/questions/live
// ============================

router.get("/live", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ isLive: true });
    
    if (!quiz) {
      return res.json([]);
    }
    
    const questions = await Question.find({
      quizId: quiz.quizId,
      published: true
    }).sort({ createdAt: 1 });
    
    res.json(questions);
    
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================
// QUIZ ARCHIVE
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
    
  } catch (err) {
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
    
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================
// DELETE COMPLETE ARCHIVE
// DELETE /api/questions/archive/:date
// ============================

router.delete("/archive/:date", async (req, res) => {
  try {
    const result = await Question.deleteMany({
      quizDate: req.params.date
    });
    
    res.json({
      success: true,
      message: `${result.deletedCount} Questions Deleted Successfully`
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================
// REUSE QUIZ (EXISTING)
// POST /api/questions/reuse/:quizId
// ============================

router.post("/reuse/:quizId", async (req, res) => {
  try {
    const oldQuestions = await Question.find({
      quizId: req.params.quizId
    });
    
    if (!oldQuestions.length) {
      return res.json({
        success: false,
        message: "No Questions Found"
      });
    }
    
    const newQuizId = req.body.quizId;
    
    const newQuestions = oldQuestions.map((q) => {
      const obj = q.toObject();
      
      delete obj._id;
      
      obj.quizId = newQuizId;
      
      return obj;
    });
    
    await Question.insertMany(newQuestions);
    
    res.json({
      success: true,
      message: `${newQuestions.length} Questions Copied`
    });
    
  } catch (err) {
    res.status(500).json({
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
      req.body,
      {
        new: true,
        runValidators: true
      }
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

module.exports = router;

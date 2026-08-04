const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  hi: String,
  en: String
}, { _id: false });

const questionSchema = new mongoose.Schema({
  questionHindi: String,
  questionEnglish: String,
  options: [optionSchema],
  answer: Number
}, { _id: false });

const quizSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true
  },
  
  topic: {
    type: String,
    default: ""
  },
  
  questions: {
    type: [questionSchema],
    default: []
  },
  
  archived: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

const Quiz = mongoose.model("Quiz", quizSchema);

// -------------------- FIX: purana "quizId" unique index --------------------
// Kabhi schema me "quizId" naam ka field tha jispar unique index bana tha.
// Ab schema me wo field hai hi nahi, lekin MongoDB collection me purana
// index (quizId_1) abhi bhi bacha hua hai. Isliye jab bhi naya quiz save
// hota hai, uska "quizId" hamesha undefined/null hota hai, aur doosre
// document se collide karke ye error aata hai:
//   E11000 duplicate key error ... dup key: { quizId: null }
// Yahan connection khulte hi (server start hote hi) us purane, ab-bekaar
// index ko ek baar safely drop kar rahe hain. Agar index pehle se hi
// nahi hai (ya pehle hata diya ja chuka hai) to error chup-chaap ignore
// ho jata hai — is se koi nuksan nahi, ye sirf ek cleanup step hai.
function dropStaleQuizIdIndex() {
  Quiz.collection.dropIndex("quizId_1").catch(() => {
    // Index exist nahi karta — kuch karne ki zaroorat nahi
  });
}

if (mongoose.connection.readyState === 1) {
  dropStaleQuizIdIndex();
} else {
  mongoose.connection.once("open", dropStaleQuizIdIndex);
}

module.exports = Quiz;

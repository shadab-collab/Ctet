// ===========================
// QUIZ FUNCTIONS
// quiz.js
// ===========================

// CREATE QUIZ
async function createQuiz() {
  
  const quizName = prompt("Enter Quiz Name");
  
  if (!quizName || !quizName.trim()) return;
  
  try {
    
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quizId: Date.now().toString(),
        quizName: quizName.trim(),
        quizDate: getToday()
      })
    });
    
    const data = await res.json();
    
    alert(data.message || data.error);
    
    loadQuizList();
    loadDashboard();
    
  } catch (err) {
    
    alert("Failed to create quiz.");
    console.log(err);
    
  }
  
}

// RENAME QUIZ
async function renameQuiz() {
  
  const quizId = document.getElementById("quizList").value;
  
  const newName = prompt("New Quiz Name");
  
  if (!newName || !newName.trim()) return;
  
  try {
    
    const quizzes = await fetch("/api/quiz").then(r => r.json());
    
    const quiz = quizzes.find(q => q.quizId === quizId);
    
    if (!quiz) {
      alert("Quiz not found.");
      return;
    }
    
    const res = await fetch("/api/quiz/" + quiz._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quizName: newName.trim()
      })
    });
    
    const data = await res.json();
    
    alert(data.message || data.error);
    
    loadQuizList();
    loadDashboard();
    
  } catch (err) {
    
    alert("Rename failed.");
    console.log(err);
    
  }
  
}

// MAKE LIVE
async function makeLiveQuiz() {
  
  const quizId = document.getElementById("quizList").value;
  
  try {
    
    const res = await fetch("/api/quiz/live/" + quizId, {
      method: "PUT"
    });
    
    const data = await res.json();
    
    alert(data.message || data.error);
    
    loadQuizList();
    loadDashboard();
    
  } catch (err) {
    
    alert("Failed to update live quiz.");
    console.log(err);
    
  }
  
}

// DELETE QUIZ
async function deleteQuiz() {
  
  const quizId = document.getElementById("quizList").value;
  
  if (!confirm("Delete Quiz?")) return;
  
  try {
    
    const quizzes = await fetch("/api/quiz").then(r => r.json());
    
    const quiz = quizzes.find(q => q.quizId === quizId);
    
    if (!quiz) {
      alert("Quiz not found.");
      return;
    }
    
    const res = await fetch("/api/quiz/" + quiz._id, {
      method: "DELETE"
    });
    
    const data = await res.json();
    
    alert(data.message || data.error);
    
    if (data.success) {
      loadQuizList();
      loadDashboard();
    }
    
  } catch (err) {
    
    alert("Delete failed.");
    console.log(err);
    
  }
  
}
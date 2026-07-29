// ===========================
// QUIZ FUNCTIONS
// quiz.js
// ===========================

// CREATE QUIZ
async function createQuiz() {
  
  const quizName = prompt("Enter Quiz Name");
  
  if (!quizName) return;
  
  const body = {
    
    quizId: Date.now().toString(),
    
    quizName: quizName,
    
    quizDate: getToday()
    
  };
  
  const res = await fetch("/api/quiz", {
    
    method: "POST",
    
    headers: {
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify(body)
    
  });
  
  const data = await res.json();
  
  alert(data.message);
  
  loadQuizList();
  
  loadDashboard();
  
}

// RENAME QUIZ
async function renameQuiz() {
  
  const quizId =
    document.getElementById("quizList").value;
  
  const newName = prompt("New Quiz Name");
  
  if (!newName) return;
  
  const quizzes =
    await fetch("/api/quiz").then(r => r.json());
  
  const quiz =
    quizzes.find(q => q.quizId === quizId);
  
  if (!quiz) return;
  
  const res = await fetch("/api/quiz/" + quiz._id, {
    
    method: "PUT",
    
    headers: {
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify({
      
      quizName: newName
      
    })
    
  });
  
  const data = await res.json();
  
  alert(data.message);
  
  loadQuizList();
  
  loadDashboard();
  
}

// MAKE LIVE
async function makeLiveQuiz() {
  
  const quizId =
    document.getElementById("quizList").value;
  
  const res = await fetch(
    
    "/api/quiz/live/" + quizId,
    
    {
      
      method: "PUT"
      
    }
    
  );
  
  const data = await res.json();
  
  alert(data.message);
  
  loadQuizList();
  
  loadDashboard();
  
}

// DELETE QUIZ
async function deleteQuiz() {
  
  const quizId =
    document.getElementById("quizList").value;
  
  if (!confirm("Delete Quiz?"))
    return;
  
  const quizzes =
    await fetch("/api/quiz").then(r => r.json());
  
  const quiz =
    quizzes.find(q => q.quizId === quizId);
  
  if (!quiz) return;
  
  const res =
    await fetch("/api/quiz/" + quiz._id, {
      
      method: "DELETE"
      
    });
  
  const data =
    await res.json();
  
  if (data.success) {
    
    alert("Quiz Deleted");
    
    loadQuizList();
    
    loadDashboard();
    
  }
  
}
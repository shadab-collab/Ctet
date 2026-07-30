const API = "/api/student";

let quiz = null;
let current = 0;
let score = 0;

const studentName = document.getElementById("studentName");

const todayTopic = document.getElementById("todayTopic");

const startPage = document.getElementById("startPage");
const quizPage = document.getElementById("quizPage");
const resultPage = document.getElementById("resultPage");

const questionHindi = document.getElementById("questionHindi");
const questionEnglish = document.getElementById("questionEnglish");

const aBtn = document.getElementById("aBtn");
const bBtn = document.getElementById("bBtn");
const cBtn = document.getElementById("cBtn");
const dBtn = document.getElementById("dBtn");

const scoreBox = document.getElementById("score");
const finalScore = document.getElementById("finalScore");

const leaderboard = document.getElementById("leaderboard");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

async function loadQuiz() {
  
  try {
    
    const res = await fetch(API + "/quiz");
    
    if (!res.ok) {
      throw new Error("Quiz Not Found");
    }
    
    quiz = await res.json();
    
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      
      todayTopic.innerHTML = "No Active Quiz";
      
      return;
      
    }
    
    todayTopic.innerHTML = "Today's Topic : " + quiz.topic;
    
  } catch (err) {
    
    todayTopic.innerHTML = "No Active Quiz";
    
    console.log(err);
    
  }
  
}

loadQuiz();



function startQuiz() {
  
  if (studentName.value.trim() == "") {
    
    alert("Enter Your Name");
    
    return;
    
  }
  
  if (!quiz) {
    
    alert("No Active Quiz");
    
    return;
    
  }
  
  current = 0;
  
  score = 0;
  
  scoreBox.innerHTML = "0";
  
  startPage.style.display = "none";
  
  quizPage.style.display = "block";
  
  resultPage.style.display = "none";
  
  showQuestion();
  
}



function showQuestion() {
  
  if (!quiz) return;
  
  if (current >= quiz.questions.length) {
    
    finishQuiz();
    
    return;
    
  }
  
  disableButtons(false);
  
  const q = quiz.questions[current];
  
  questionHindi.innerHTML = q.questionHindi;
  
  questionEnglish.innerHTML = q.questionEnglish;
  
  aBtn.innerHTML = "A. " + q.options[0].hi;
  
  bBtn.innerHTML = "B. " + q.options[1].hi;
  
  cBtn.innerHTML = "C. " + q.options[2].hi;
  
  dBtn.innerHTML = "D. " + q.options[3].hi;
  
}



function disableButtons(state) {
  
  aBtn.disabled = state;
  
  bBtn.disabled = state;
  
  cBtn.disabled = state;
  
  dBtn.disabled = state;
  
}
// -------------------- ANSWER --------------------

function checkAnswer(selected) {
  
  disableButtons(true);
  
  const q = quiz.questions[current];
  
  if (selected === q.answer) {
    
    score++;
    
    scoreBox.innerHTML = score;
    
    if (correctSound) {
      correctSound.currentTime = 0;
      correctSound.play().catch(() => {});
    }
    
  } else {
    
    if (wrongSound) {
      wrongSound.currentTime = 0;
      wrongSound.play().catch(() => {});
    }
    
  }
  
  setTimeout(() => {
    
    current++;
    
    if (current >= quiz.questions.length) {
      
      finishQuiz();
      
    } else {
      
      showQuestion();
      
    }
    
  }, 700);
  
}



// -------------------- FINISH --------------------

function finishQuiz() {
  
  quizPage.style.display = "none";
  
  resultPage.style.display = "block";
  
  finalScore.innerHTML =
    
    "Your Score : " + score + " / " + quiz.questions.length;
  
  saveResult();
  
}



// -------------------- SAVE RESULT --------------------

async function saveResult() {
  
  try {
    
    const res = await fetch(API + "/result", {
      
      method: "POST",
      
      headers: {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify({
        
        studentName: studentName.value.trim(),
        
        quizId: quiz._id,
        
        score: score,
        
        total: quiz.questions.length
        
      })
      
    });
    
    if (!res.ok) {
      
      alert("Result Save Failed");
      
      return;
      
    }
    
    loadLeaderboard();
    
  } catch (err) {
    
    console.log(err);
    
  }
  
}



// -------------------- LEADERBOARD --------------------

async function loadLeaderboard() {
  
  try {
    
    const res = await fetch(API + "/leaderboard");
    
    const data = await res.json();
    
    leaderboard.innerHTML = "";
    
    if (data.length === 0) {
      
      leaderboard.innerHTML = "<p>No Result Yet</p>";
      
      return;
      
    }
    
    data.forEach((s, index) => {
      
      leaderboard.innerHTML += `

            <div style="padding:8px;border-bottom:1px solid #ddd;">

            <b>${index+1}. ${s.studentName}</b>

            <br>

            Score : ${s.score}/${s.total}

            </div>

            `;
      
    });
    
  } catch (err) {
    
    console.log(err);
    
  }
  
}
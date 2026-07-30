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

const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");

const optionButtons = [
  aBtn,
  bBtn,
  cBtn,
  dBtn
];

const scoreBox = document.getElementById("score");
const finalScore = document.getElementById("finalScore");

const leaderboard = document.getElementById("leaderboard");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
// -------------------- LOAD QUIZ --------------------

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



// -------------------- START QUIZ --------------------

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



// -------------------- SHOW QUESTION --------------------

function showQuestion() {
  
  if (!quiz) return;
  
  if (current >= quiz.questions.length) {
    
    finishQuiz();
    
    return;
    
  }
  
  progress.innerHTML =
    "Question " + (current + 1) + " / " + quiz.questions.length;
  
  nextBtn.style.display = "none";
  
  optionButtons.forEach(btn => {
    
    btn.disabled = false;
    
    btn.style.background = "";
    
    btn.style.color = "";
    
  });
  
  const q = quiz.questions[current];
  
  questionHindi.innerHTML = q.questionHindi;
  
  questionEnglish.innerHTML = q.questionEnglish || "";
  
  aBtn.innerHTML =
  "<b>A.</b> " + q.options[0].hi +
  "<br><small>" + (q.options[0].en || "") + "</small>";
  
  bBtn.innerHTML =
  "<b>B.</b> " + q.options[1].hi +
  "<br><small>" + (q.options[1].en || "") + "</small>";
  
  cBtn.innerHTML =
  "<b>C.</b> " + q.options[2].hi +
  "<br><small>" + (q.options[2].en || "") + "</small>";
  
  dBtn.innerHTML =
  "<b>D.</b> " + q.options[3].hi +
  "<br><small>" + (q.options[3].en || "") + "</small>";
  
}



// -------------------- DISABLE BUTTONS --------------------

function disableButtons(state) {
  
  optionButtons.forEach(btn => {
    
    btn.disabled = state;
    
  });
  
}
// -------------------- ANSWER --------------------

function checkAnswer(selected) {
  
  disableButtons(true);
  
  const q = quiz.questions[current];
  
  if (selected === q.answer) {
    
    score++;
    
    scoreBox.innerHTML = score;
    
    optionButtons[selected].style.background = "#2e7d32";
    optionButtons[selected].style.color = "#fff";
    
    if (correctSound) {
      
      correctSound.currentTime = 0;
      
      correctSound.play().catch(() => {});
      
    }
    
  } else {
    
    optionButtons[selected].style.background = "#d32f2f";
    optionButtons[selected].style.color = "#fff";
    
    optionButtons[q.answer].style.background = "#2e7d32";
    optionButtons[q.answer].style.color = "#fff";
    
    if (wrongSound) {
      
      wrongSound.currentTime = 0;
      
      wrongSound.play().catch(() => {});
      
    }
    
  }
  
  nextBtn.style.display = "inline-block";
  
}



// -------------------- NEXT QUESTION --------------------

function nextQuestion() {
  
  current++;
  
  if (current >= quiz.questions.length) {
    
    finishQuiz();
    
    return;
    
  }
  
  showQuestion();
  
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
    
    if (res.ok) {
      
      loadLeaderboard();
      
    }
    
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

            <div style="padding:10px;border-bottom:1px solid #ddd;">

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

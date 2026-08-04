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

// Testbook jaisa light color palette (style.css ke --correct-* / --wrong-*
// variables se match karta hai). Sirf yahi color values badli gayi hain,
// baaki poora logic bilkul waisa hi hai jaisa pehle tha.
const CORRECT_BG = "#d9f2e1";
const CORRECT_BORDER = "#4caf78";
const CORRECT_TEXT = "#157347";

const WRONG_BG = "#fbdfe0";
const WRONG_BORDER = "#e57373";
const WRONG_TEXT = "#c62828";

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
  
  quizPage.style.display = "flex";
  
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
    
    btn.style.borderColor = "";
    
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
    
    optionButtons[selected].style.background = CORRECT_BG;
    optionButtons[selected].style.color = CORRECT_TEXT;
    optionButtons[selected].style.borderColor = CORRECT_BORDER;
    
    if (correctSound) {
      
      correctSound.currentTime = 0;
      
      correctSound.play().catch(() => {});
      
    }
    
  } else {
    
    optionButtons[selected].style.background = WRONG_BG;
    optionButtons[selected].style.color = WRONG_TEXT;
    optionButtons[selected].style.borderColor = WRONG_BORDER;
    
    optionButtons[q.answer].style.background = CORRECT_BG;
    optionButtons[q.answer].style.color = CORRECT_TEXT;
    optionButtons[q.answer].style.borderColor = CORRECT_BORDER;
    
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

            <div class="lbRow">

            <span class="lbName"><span class="lbRank">${index+1}</span>${s.studentName}</span>

            <span class="lbScore">${s.score}/${s.total}</span>

            </div>

            `;
      
    });
    
  } catch (err) {
    
    console.log(err);
    
  }
  
}

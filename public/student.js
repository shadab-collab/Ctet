const API = "/api/student";

let quiz = null;
let current = 0;
let score = 0;

const todayTopic = document.getElementById("todayTopic");

const questionHindi = document.getElementById("questionHindi");
const questionEnglish = document.getElementById("questionEnglish");

const aBtn = document.getElementById("aBtn");
const bBtn = document.getElementById("bBtn");
const cBtn = document.getElementById("cBtn");
const dBtn = document.getElementById("dBtn");

const scoreBox = document.getElementById("score");

const startPage = document.getElementById("startPage");
const quizPage = document.getElementById("quizPage");
const resultPage = document.getElementById("resultPage");

const finalScore = document.getElementById("finalScore");
const leaderboard = document.getElementById("leaderboard");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

async function loadQuiz() {
  
  const res = await fetch(API + "/quiz");
  
  quiz = await res.json();
  
  todayTopic.innerHTML = "Today's Topic : " + quiz.topic;
  
}

loadQuiz();


function startQuiz() {
  
  if (studentName.value.trim() == "") {
    
    alert("Enter Name");
    
    return;
    
  }
  
  startPage.style.display = "none";
  
  quizPage.style.display = "block";
  
  showQuestion();
  
}


function showQuestion() {
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


function checkAnswer(selected) {
  
  disableButtons(true);
  
  const q = quiz.questions[current];
  
  if (selected === q.answer) {
    
    score++;
    
    scoreBox.innerHTML = score;
    
    correctSound.play();
    
  } else {
    
    wrongSound.play();
    
  }
  
  setTimeout(() => {
    
    current++;
    
    if (current >= quiz.questions.length) {
      
      finishQuiz();
      
    } else {
      
      showQuestion();
      
      disableButtons(false);
      
    }
    
  }, 700);
  
}


function finishQuiz() {
  
  quizPage.style.display = "none";
  
  resultPage.style.display = "block";
  
  finalScore.innerHTML =
    "Your Score : " + score + " / " + quiz.questions.length;
  
  saveResult();
  
}


async function saveResult() {
  
  await fetch(API + "/result", {
    
    method: "POST",
    
    headers: {
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify({
      
      studentName: studentName.value,
      
      quizId: quiz._id,
      
      score: score,
      
      total: quiz.questions.length
      
    })
    
  });
  
  loadLeaderboard();
  
}


async function loadLeaderboard() {
  
  const res = await fetch(API + "/leaderboard");
  
  const data = await res.json();
  
  leaderboard.innerHTML = "";
  
  data.forEach((s, index) => {
    
    leaderboard.innerHTML += `

        <p>

        ${index+1}.
        ${s.studentName}

        -

        ${s.score}/${s.total}

        </p>

        `;
    
  });
  
}
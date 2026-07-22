// =============================
// CTET QUIZ
// script.js (Part 1)
// =============================

let currentQuestion = 0;
let score = 0;
let studentName = "";

const loginBox = document.getElementById("loginBox");
const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");
const leaderboardBox = document.getElementById("leaderboardBox");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const numberEl = document.getElementById("questionNumber");

const correctSound =
  document.getElementById("correctSound");

const wrongSound =
  document.getElementById("wrongSound");

function startQuiz() {
  
  studentName =
    document.getElementById("studentName").value.trim();
  
  if (studentName == "") {
    
    alert("अपना नाम लिखें");
    
    return;
    
  }
  
  loginBox.style.display = "none";
  
  quizBox.style.display = "block";
  
  loadQuestion();
  
}

function loadQuestion() {
  
  const q = questions[currentQuestion];
  
  numberEl.innerHTML =
    "Question " +
    (currentQuestion + 1) +
    " / " +
    questions.length;
  
  scoreEl.innerHTML =
    "Score : " +
    score;
  
  questionEl.innerHTML = q.question;
  
  optionsEl.innerHTML = "";
  
  q.options.forEach(function(option, index) {
    
    const div = document.createElement("div");
    
    div.className = "option";
    
    div.innerHTML = option;
    
    div.onclick = function() {
      
      checkAnswer(div, index);
      
    };
    
    optionsEl.appendChild(div);
    
  });
  
  document.getElementById("nextBtn").style.display = "none";
  
}

function checkAnswer(box, index) {
  
  const q = questions[currentQuestion];
  
  const all = document.querySelectorAll(".option");
  
  all.forEach(function(item) {
    
    item.style.pointerEvents = "none";
    
  });
  
  if (index == q.answer) {
    
    box.classList.add("correct");
    
    score++;
    
    scoreEl.innerHTML =
      "Score : " + score;
    
    correctSound.play();
    
  } else {
    
    box.classList.add("wrong");
    
    all[q.answer].classList.add("correct");
    
    wrongSound.play();
    
  }
  
  document.getElementById("nextBtn").style.display = "block";
  
}
// =============================
// script.js (Part 2)
// =============================

function nextQuestion() {
  
  currentQuestion++;
  
  // हर 10 प्रश्न के बाद Leaderboard
  if (currentQuestion > 0 && currentQuestion % 10 === 0 && currentQuestion < questions.length) {
    
    showLeaderboard();
    return;
  }
  
  // टेस्ट समाप्त
  if (currentQuestion >= questions.length) {
    
    finishQuiz();
    return;
  }
  
  loadQuestion();
}
await saveResult();

await loadLeaderboard();

// =============================

function showLeaderboard() {
  
  quizBox.style.display = "none";
  leaderboardBox.style.display = "block";
  
  leaderboard.push({
    name: studentName,
    score: score
  });
  
  leaderboard.sort(function(a, b) {
    return b.score - a.score;
  });
  
  let html = "";
  
  leaderboard.forEach(function(item, index) {
    
    let cls = "rank";
    
    if (index == 0) cls += " gold";
    else if (index == 1) cls += " silver";
    else if (index == 2) cls += " bronze";
    
    html += `
        <div class="${cls}">
            <span>${index + 1}. ${item.name}</span>
            <span>${item.score}</span>
        </div>
        `;
  });
  
  document.getElementById("leaderboard").innerHTML = html;
}

// =============================

function continueQuiz() {
  
  leaderboardBox.style.display = "none";
  quizBox.style.display = "block";
  
  loadQuestion();
}

// =============================

function finishQuiz() {
  
  quizBox.style.display = "none";
  
  resultBox.style.display = "block";
  
  leaderboard.push({
    name: studentName,
    score: score
  });
  
  leaderboard.sort(function(a, b) {
    return b.score - a.score;
  });
  
  document.getElementById("finalName").innerHTML =
    "Name : " + studentName;
  
  document.getElementById("finalScore").innerHTML =
    score + " / " + questions.length;
  
  let html = "";
  
  leaderboard.forEach(function(item, index) {
    
    let cls = "rank";
    
    if (index == 0) cls += " gold";
    else if (index == 1) cls += " silver";
    else if (index == 2) cls += " bronze";
    
    html += `
        <div class="${cls}">
            <span>${index + 1}. ${item.name}</span>
            <span>${item.score}</span>
        </div>
        `;
  });
  
  document.getElementById("finalLeaderboard").innerHTML = html;
}
// ============================
// MongoDB API URL
// ============================

const API = "http://localhost:3000/api/results";


// ============================
// Result Save
// ============================

async function saveResult() {
  
  await fetch(API, {
    
    method: "POST",
    
    headers: {
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify({
      
      name: studentName,
      
      score: score,
      
      total: questions.length
      
    })
    
  });
  
}


// ============================
// Leaderboard
// ============================

async function loadLeaderboard() {
  
  const res = await fetch(API);
  
  const data = await res.json();
  
  let html = "";
  
  data.forEach(function(item, index) {
    
    html += `
        <div class="rank">
            <span>${index+1}. ${item.name}</span>
            <span>${item.score}/${item.total}</span>
        </div>
        `;
    
  });
  
  document.getElementById("leaderboard").innerHTML = html;
  
  document.getElementById("finalLeaderboard").innerHTML = html;
  
}

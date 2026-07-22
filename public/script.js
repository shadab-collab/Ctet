// ===============================
// CTET QUIZ
// Part 1
// ===============================

const API = "/api/results";

let currentQuestion = 0;
let score = 0;
let studentName = "";

const loginBox = document.getElementById("loginBox");
const quizBox = document.getElementById("quizBox");
const leaderboardBox = document.getElementById("leaderboardBox");
const resultBox = document.getElementById("resultBox");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const numberEl = document.getElementById("questionNumber");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function startQuiz() {
  
  studentName = document
    .getElementById("studentName")
    .value
    .trim();
  
  if (studentName === "") {
    
    alert("अपना नाम लिखें");
    return;
    
  }
  
  currentQuestion = 0;
  score = 0;
  
  loginBox.style.display = "none";
  quizBox.style.display = "block";
  
  loadQuestion();
  
}

function loadQuestion() {
  
  const q = questions[currentQuestion];
  
  numberEl.innerHTML =
    `Question ${currentQuestion+1}/${questions.length}`;
  
  scoreEl.innerHTML =
    `Score : ${score}`;
  
  questionEl.innerHTML = q.question;
  
  optionsEl.innerHTML = "";
  
  q.options.forEach((option, index) => {
    
    const div = document.createElement("div");
    
    div.className = "option";
    
    div.innerHTML = option;
    
    div.onclick = () => selectOption(div, index);
    
    optionsEl.appendChild(div);
    
  });
  
  document.getElementById("nextBtn").style.display = "none";
  
}
// ===============================
// CTET QUIZ
// Part 2
// ===============================

function selectOption(box, index) {
  
  const q = questions[currentQuestion];
  
  const all = document.querySelectorAll(".option");
  
  all.forEach(item => {
    item.style.pointerEvents = "none";
  });
  
  if (index === q.answer) {
    
    box.classList.add("correct");
    
    score++;
    
    scoreEl.innerHTML = `Score : ${score}`;
    
    if (correctSound) {
      correctSound.currentTime = 0;
      correctSound.play();
    }
    
  } else {
    
    box.classList.add("wrong");
    
    all[q.answer].classList.add("correct");
    
    if (wrongSound) {
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
    
  }
  
  document.getElementById("nextBtn").style.display = "block";
  
}

function nextQuestion() {
  
  currentQuestion++;
  
  if (currentQuestion >= questions.length) {
    
    finishQuiz();
    return;
    
  }
  
  if (currentQuestion > 0 &&
    currentQuestion % 10 === 0) {
    
    showLeaderboard();
    return;
    
  }
  
  loadQuestion();
  
}

function continueQuiz() {
  
  leaderboardBox.style.display = "none";
  
  quizBox.style.display = "block";
  
  loadQuestion();
  
}
// ===============================
// CTET QUIZ
// Part 3
// ===============================

// Result Save

async function saveResult() {
  
  try {
    
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
    
  } catch (err) {
    
    console.log(err);
    
  }
  
}



// Leaderboard Load

async function loadLeaderboard() {
  
  try {
    
    const res = await fetch(API);
    
    const data = await res.json();
    
    let html = "";
    
    data.forEach((item, index) => {
      
      let cls = "rank";
      
      if (index === 0) cls += " gold";
      if (index === 1) cls += " silver";
      if (index === 2) cls += " bronze";
      
      html += `
            <div class="${cls}">
                <span>${index+1}. ${item.name}</span>
                <span>${item.score}/${item.total}</span>
            </div>
            `;
      
    });
    
    document.getElementById("leaderboard").innerHTML = html;
    document.getElementById("finalLeaderboard").innerHTML = html;
    
  } catch (err) {
    
    console.log(err);
    
  }
  
}



// Quiz Finish

async function finishQuiz() {
  
  quizBox.style.display = "none";
  
  resultBox.style.display = "block";
  
  document.getElementById("finalName").innerHTML =
    "Name : " + studentName;
  
  document.getElementById("finalScore").innerHTML =
    score + " / " + questions.length;
  
  await saveResult();
  
  await loadLeaderboard();
  
}
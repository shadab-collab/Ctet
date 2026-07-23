// =====================================
// CTET LIVE QUIZ
// script.js (Part 1)
// =====================================

// ---------- API ----------

const RESULT_API = "/api/results";
const QUESTION_API = "/api/questions";

// ---------- Variables ----------

let questions = [];
let currentQuestion = 0;
let score = 0;
let studentName = "";

// ---------- Elements ----------

const loginBox = document.getElementById("loginBox");
const quizBox = document.getElementById("quizBox");
const leaderboardBox = document.getElementById("leaderboardBox");
const resultBox = document.getElementById("resultBox");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");

const scoreEl = document.getElementById("score");
const numberEl = document.getElementById("questionNumber");

const correctSound =
  document.getElementById("correctSound");

const wrongSound =
  document.getElementById("wrongSound");

// =====================================
// START QUIZ
// =====================================

async function startQuiz() {
  
  studentName =
    document
    .getElementById("studentName")
    .value
    .trim();
  
  if (studentName == "") {
    
    alert("अपना नाम लिखें");
    
    return;
    
  }
  
  try {
    
    const res =
      await fetch(QUESTION_API);
    
    questions =
      await res.json();
    
  } catch (err) {
    
    alert("Question Loading Failed");
    
    console.log(err);
    
    return;
    
  }
  
  if (questions.length === 0) {
    
    alert("आज का Quiz उपलब्ध नहीं है");
    
    return;
    
  }
  
  currentQuestion = 0;
  
  score = 0;
  
  loginBox.style.display = "none";
  
  quizBox.style.display = "block";
  
  loadQuestion();
  
}
// =====================================
// LOAD QUESTION
// =====================================

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
  
  // Hindi + English Question
  
  questionEl.innerHTML =
    
    `<div class="q-hi">

        ${q.questionHindi}

    </div>

    <br>

    <div class="q-en">

        ${q.questionEnglish}

    </div>`;
  
  optionsEl.innerHTML = "";
  
  q.options.forEach((option, index) => {
    
    const div =
      document.createElement("div");
    
    div.className = "option";
    
    div.innerHTML =
      
      `<b>

            ${String.fromCharCode(65+index)}.

        </b>

        <div>

            ${option.hi}

            <br>

            <small>

            ${option.en}

            </small>

        </div>`;
    
    div.onclick = function() {
      
      selectOption(div, index);
      
    };
    
    optionsEl.appendChild(div);
    
  });
  
  document
    .getElementById("nextBtn")
    .style.display = "none";
  
}
// =====================================
// CHECK ANSWER
// =====================================

function selectOption(box, index) {
  
  const q = questions[currentQuestion];
  
  const all =
    document.querySelectorAll(".option");
  
  // दोबारा क्लिक न हो
  all.forEach(item => {
    item.style.pointerEvents = "none";
  });
  
  if (index === q.answer) {
    
    box.classList.add("correct");
    
    score++;
    
    scoreEl.innerHTML =
      "Score : " + score;
    
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
  
  document
    .getElementById("nextBtn")
    .style.display = "block";
  
}

// =====================================
// NEXT QUESTION
// =====================================

function nextQuestion() {
  
  currentQuestion++;
  
  // हर 10 प्रश्न पर Leaderboard
  if (
    currentQuestion > 0 &&
    currentQuestion % 100 === 0 &&
    currentQuestion < questions.length
  ) {
    
    showLeaderboard();
    
    return;
    
  }
  
  // Quiz समाप्त
  if (currentQuestion >= questions.length) {
    
    finishQuiz();
    
    return;
    
  }
  
  loadQuestion();
  
}
// =====================================
// LEADERBOARD
// =====================================

async function loadLeaderboard() {
  
  try {
    
    const res = await fetch(RESULT_API);
    
    const data = await res.json();
    
    let html = "";
    
    data.forEach((item, index) => {
      
      let cls = "rank";
      
      if (index === 0) cls += " gold";
      else if (index === 1) cls += " silver";
      else if (index === 2) cls += " bronze";
      
      html += `
            <div class="${cls}">
                <span>
                    ${index+1}. ${item.name}
                </span>

                <span>
                    ${item.score}/${item.total}
                </span>
            </div>
            `;
      
    });
    
    document.getElementById("leaderboard").innerHTML = html;
    
    document.getElementById("finalLeaderboard").innerHTML = html;
    
  }
  
  catch (err) {
    
    console.log(err);
    
  }
  
}



// =====================================
// SHOW LEADERBOARD
// =====================================

async function showLeaderboard() {
  
  quizBox.style.display = "none";
  
  leaderboardBox.style.display = "block";
  
  await loadLeaderboard();
  
}



// =====================================
// CONTINUE QUIZ
// =====================================

function continueQuiz() {
  
  leaderboardBox.style.display = "none";
  
  quizBox.style.display = "block";
  
  loadQuestion();
  
}
// =====================================
// SAVE RESULT
// =====================================

async function saveResult() {
  
  try {
    
    await fetch(RESULT_API, {
      
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
  
  catch (err) {
    
    console.log(err);
    
  }
  
}



// =====================================
// FINISH QUIZ
// =====================================

async function finishQuiz() {
  
  quizBox.style.display = "none";
  
  resultBox.style.display = "block";
  
  // Result Save
  
  await saveResult();
  
  // Latest Leaderboard
  
  await loadLeaderboard();
  
  // Student Result
  
  document.getElementById("finalName").innerHTML =
    
    "Name : " + studentName;
  
  document.getElementById("finalScore").innerHTML =
    
    score + " / " + questions.length;
  
}



// =====================================
// RESTART QUIZ
// =====================================

function restartQuiz() {
  
  currentQuestion = 0;
  
  score = 0;
  
  studentName = "";
  
  resultBox.style.display = "none";
  
  leaderboardBox.style.display = "none";
  
  quizBox.style.display = "none";
  
  loginBox.style.display = "block";
  
  document.getElementById("studentName").value = "";
  
}



// =====================================
// OPTIONAL
// ENTER KEY START
// =====================================

document
  .getElementById("studentName")
  .addEventListener("keydown", function(e) {
    
    if (e.key === "Enter") {
      
      startQuiz();
      
    }
    
  });
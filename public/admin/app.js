// ===========================
// APP CONFIG
// app.js
// ===========================

// API URL
const API = "/api/questions";

// Edit Mode
let editingId = null;

// Page Load
window.onload = () => {
  
  loadQuestions();
  
};

// ===========================
// GET TODAY
// ===========================

function getToday() {
  
  return new Date()
    .toISOString()
    .slice(0, 10);
  
}

// ===========================
// GET VALUE
// ===========================

function value(id) {
  
  return document
    .getElementById(id)
    .value
    .trim();
  
}

// ===========================
// SET VALUE
// ===========================

function setValue(id, text) {
  
  document
    .getElementById(id)
    .value = text;
  
}

// ===========================
// CLEAR EDIT MODE
// ===========================

function stopEditing() {
  
  editingId = null;
  
}

// ===========================
// SCROLL TOP
// ===========================

function scrollTopForm() {
  
  window.scrollTo({
    
    top: 0,
    
    behavior: "smooth"
    
  });
  
}
// ===========================
// LOAD 
// ===========================

window.addEventListener("load", loadTopic);

async function loadTopic() {
  
  try {
    
    const res = await fetch("/api/topic");
    
    const data = await res.json();
    
    document.getElementById("todayTopic").value = data.title;
    
  }
  
  catch (err) {
    
    console.log(err);
    
  }
  
}


// ===========================
// SAVE TOPIC
// ===========================

async function saveTopic() {
  
  const title = document
    .getElementById("todayTopic")
    .value
    .trim();
  
  if (title === "") {
    
    alert("Topic लिखें");
    
    return;
    
  }
  
  try {
    
    const res = await fetch("/api/topic", {
      
      method: "PUT",
      
      headers: {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify({
        title: title
      })
      
    });
    
    const data = await res.json();
    
    alert(data.message);
    
    loadTopic();
    
  }
  
  catch (err) {
    
    console.log(err);
    
    alert("Topic Save Failed");
    
  }
  
}
const QUIZ_API = "/api/quiz";

// ===========================
// LOAD QUIZ LIST (UPDATED)
// ===========================

async function loadQuizList() {

    const res = await fetch(QUIZ_API);

    const quizzes = await res.json();

    let html = "";

    quizzes.forEach(q => {

        html += `
        <option value="${q.quizId}">
            ${q.quizName}
            ${q.isLive ? " ⭐" : ""}
        </option>
        `;

    });

    document.getElementById("quizList").innerHTML = html;

}

window.addEventListener("load", loadQuizList);

async function createQuiz() {
  
  const quizName =
    document
    .getElementById("newQuizName")
    .value
    .trim();
  
  if (!quizName) {
    
    alert("Quiz Name लिखिए");
    
    return;
  
  }
  
  const quizId =
    Date.now().toString();
  
  const body = {
    
    quizId,
    
    quizName,
    
    quizDate: getToday(),
    
    topic: "",
    
    isLive: false
    
  };
  
  const res = await fetch(QUIZ_API, {
    
    method: "POST",
    
    headers: {
      
      "Content-Type": "application/json"
      
    },
    
    body: JSON.stringify(body)
    
  });
  
  const data = await res.json();
  
  alert(data.message);
  
  document.getElementById("newQuizName").value = "";
  
  loadQuizList();
  
}

// ===========================
// MAKE LIVE QUIZ
// ===========================

async function makeLiveQuiz(){

    const quizId =
        document.getElementById("quizList").value;

    const res = await fetch(

        "/api/quiz/live/" + quizId,

        {

            method:"PUT"

        }

    );

    const data = await res.json();

    alert(data.message);

    loadQuizList();

}

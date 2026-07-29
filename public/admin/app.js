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
// LOAD TOPIC
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

async function loadQuizList(){

    const res = await fetch("/api/quiz");

    const quizzes = await res.json();

    let html = "";

    quizzes.forEach(q=>{

        html += `

        <option value="${q.quizId}">

        ${q.isLive ? "🟢 " : ""}

        ${q.quizName}

        (${q.questionCount})

        </option>

        `;

    });

    document.getElementById("quizList").innerHTML = html;

    if(quizzes.length){

        loadQuestions();

    }

}

// Event listener added right after loadQuizList
document
  .getElementById("quizList")
  .addEventListener(
    "change",
    loadQuestions
  );

window.addEventListener("load", loadQuizList);

// ===========================
// CREATE QUIZ (UPDATED)
// ===========================

async function createQuiz(){

    const quizName =
        document
        .getElementById("newQuizName")
        .value
        .trim();

    const topic =
        document
        .getElementById("newQuizTopic")
        .value
        .trim();

    if(!quizName){

        alert("Quiz Name लिखिए");

        return;

    }

    const quizId = Date.now().toString();

    const body={

        quizId,

        quizName,

        quizDate:getToday(),

        topic,

        isLive:false

    };

    const res = await fetch("/api/quiz",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(body)

    });

    const data = await res.json();

    if(data.success){

        alert("Quiz Created");

        await loadQuizList();

        document.getElementById("quizList").value = quizId;

        loadQuestions();

        document.getElementById("newQuizName").value="";

        document.getElementById("newQuizTopic").value="";

    }else{

        alert(data.error);

    }

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

// ===========================
// MERGE QUIZ LIST
// ===========================

async function loadMergeQuizList() {
  
  const res = await fetch("/api/quiz");
  
  const quizzes = await res.json();
  
  let html = "";
  
  quizzes.forEach(q => {
    
    html += `
        <label style="display:block;margin:8px 0;">

            <input
            type="checkbox"
            value="${q.quizId}">

            ${q.quizName}

        </label>
        `;
    
  });
  
  document.getElementById("mergeQuizList").innerHTML = html;
  
}

window.addEventListener("load", loadMergeQuizList);

async function mergeQuiz() {
  
  const checked = [
    
    ...document.querySelectorAll(
      
      "#mergeQuizList input:checked"
      
    )
    
  ];
  
  if (checked.length < 2) {
    
    alert("कम से कम 2 Quiz चुनिए");
    
    return;
  
  }
  
  const quizIds = checked.map(x => x.value);
  
  const quizName =
    
    document
    .getElementById("mergeQuizName")
    .value
    .trim();
  
  if (!quizName) {
    
    alert("Quiz Name लिखिए");
    
    return;
  
  }
  
  const res = await fetch(
    
    "/api/quiz/merge",
    
    {
      
      method: "POST",
      
      headers: {
        
        "Content-Type": "application/json"
        
      },
      
      body: JSON.stringify({
        
        quizIds,
        
        quizName
        
      })
      
    }
    
  );
  
  const data = await res.json();
  
  alert(data.message);
  
  loadQuizList();
  
  loadMergeQuizList();
  
}

async function renameQuiz() {
  
  const quizId =
    document.getElementById("quizList").value;
  
  if (!quizId) {
    
    alert("Select Quiz");
    
    return;
    
  }
  
  const newName = prompt("New Quiz Name");
  
  if (!newName) return;
  
  const quizzes =
    await fetch("/api/quiz")
    .then(r => r.json());
  
  const quiz =
    quizzes.find(q => q.quizId === quizId);
  
  if (!quiz) {
    
    alert("Quiz Not Found");
    
    return;
    
  }
  
  const res =
    await fetch("/api/quiz/" + quiz._id, {
      
      method: "PUT",
      
      headers: {
        
        "Content-Type": "application/json"
        
      },
      
      body: JSON.stringify({
        
        quizName: newName
        
      })
      
    });
  
  const data =
    await res.json();
  
  alert(data.message);
  
  loadQuizList();
  
}

async function makeLiveQuiz() {
  
  const quizId =
    document.getElementById("quizList").value;
  
  if (!quizId) {
    
    alert("Select Quiz");
    
    return;
    
  }
  
  const res = await fetch(
    
    "/api/quiz/live/" + quizId,
    
    {
      
      method: "PUT"
      
    }
    
  );
  
  const data = await res.json();
  
  alert(data.message);
  
  loadQuizList();
  
}
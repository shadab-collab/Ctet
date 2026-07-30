const API = "/api/admin";

let questions = [];
let editIndex = -1; // Edit index variables

// DOM Elements
const quizTitle = document.getElementById("quizTitle");
const topic = document.getElementById("topic");
const bulkText = document.getElementById("bulkText");
const questionList = document.getElementById("questionList");
const activeQuiz = document.getElementById("activeQuiz");
const archiveQuiz = document.getElementById("archiveQuiz");
const leaderboard = document.getElementById("leaderboard");

// Edit Box Elements
const editBox = document.getElementById("editBox");
const eqh = document.getElementById("eqh");
const eqe = document.getElementById("eqe");
const aH = document.getElementById("aH");
const aE = document.getElementById("aE");
const bH = document.getElementById("bH");
const bE = document.getElementById("bE");
const cH = document.getElementById("cH");
const cE = document.getElementById("cE");
const dH = document.getElementById("dH");
const dE = document.getElementById("dE");
const ans = document.getElementById("ans");

// Helper function to extract regex values from input block
function getValue(block, label) {
  const regex = new RegExp(label + "\\s*([\\s\\S]*?)(?=\\n[A-Za-z ]+:|$)");
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

// Bulk Question Importer
function importQuestions() {
  questions = [];
  const text = bulkText.value.trim();
  const blocks = (text.match(/Question Hindi:[\s\S]*?(?=Question Hindi:|$)/g) || []);

  blocks.forEach(block => {
    const ansVal = getValue(block, "Answer:");
    questions.push({
      questionHindi: getValue(block, "Question Hindi:"),
      questionEnglish: getValue(block, "Question English:"),
      options: [
        { hi: getValue(block, "A Hindi:"), en: getValue(block, "A English:") },
        { hi: getValue(block, "B Hindi:"), en: getValue(block, "B English:") },
        { hi: getValue(block, "C Hindi:"), en: getValue(block, "C English:") },
        { hi: getValue(block, "D Hindi:"), en: getValue(block, "D English:") }
      ],
      answer: { A: 0, B: 1, C: 2, D: 3 }[ansVal]
    });
  });

  showQuestions();
}

// Render Imported Questions
function showQuestions() {
  questionList.innerHTML = "";
  questions.forEach((q, index) => {
    questionList.innerHTML += `
        <div style="border:1px solid #ccc;padding:10px;margin:10px;">
          <b>Q${index + 1}</b>
          <br><br>
          ${q.questionHindi}
          <br><br>
          A. ${q.options[0].hi}
          <br>
          B. ${q.options[1].hi}
          <br>
          C. ${q.options[2].hi}
          <br>
          D. ${q.options[3].hi}
          <br><br>
          Answer : ${["A", "B", "C", "D"][q.answer]}
          <br><br>
          <button onclick="editQuestion(${index})">Edit</button>
          <button onclick="deleteQuestion(${index})">Delete</button>
        </div>
    `;
  });
}

// Edit Question Function
function editQuestion(index) {
  editIndex = index;
  const q = questions[index];

  editBox.style.display = "block";

  eqh.value = q.questionHindi;
  eqe.value = q.questionEnglish;

  aH.value = q.options[0].hi;
  aE.value = q.options[0].en;

  bH.value = q.options[1].hi;
  bE.value = q.options[1].en;

  cH.value = q.options[2].hi;
  cE.value = q.options[2].en;

  dH.value = q.options[3].hi;
  dE.value = q.options[3].en;

  ans.value = ["A", "B", "C", "D"][q.answer];
}

// Update Question Function
function updateQuestion() {
  if (editIndex === -1) return;

  const q = questions[editIndex];

  q.questionHindi = eqh.value;
  q.questionEnglish = eqe.value;

  q.options[0].hi = aH.value;
  q.options[0].en = aE.value;

  q.options[1].hi = bH.value;
  q.options[1].en = bE.value;

  q.options[2].hi = cH.value;
  q.options[2].en = cE.value;

  q.options[3].hi = dH.value;
  q.options[3].en = dE.value;

  q.answer = {
    A: 0,
    B: 1,
    C: 2,
    D: 3
  }[ans.value];

  editBox.style.display = "none";
  showQuestions();
}

// Delete Question Function
function deleteQuestion(index) {
  if (!confirm("Delete Question?")) return;
  
  questions.splice(index, 1);
  showQuestions();
}

// Save Quiz API Request
async function saveQuiz() {
  if (quizTitle.value.trim() === "") {
    alert("Enter Quiz Name");
    return;
  }

  if (questions.length === 0) {
    alert("No Questions");
    return;
  }

  const res = await fetch(API + "/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: quizTitle.value,
      topic: topic.value,
      questions: questions
    })
  });

  const data = await res.json();
  alert(data.message);
  loadQuiz();
}

// Load Active Quizzes
async function loadQuiz() {
  const res = await fetch(API + "/quiz");
  const data = await res.json();
  activeQuiz.innerHTML = "";

  data.forEach((q) => {
    activeQuiz.innerHTML += `
        <div style="border:1px solid gray;padding:10px;margin:10px;">
          <b>${q.title}</b>
          <br>
          Topic : ${q.topic}
          <br>
          Questions : ${q.questions.length}
          <br><br>
          <button onclick="archiveQuiz('${q._id}')">Archive</button>
          <button onclick="deleteQuiz('${q._id}')">Delete</button>
        </div>
    `;
  });
}

// Archive Quiz API Request
async function archiveQuiz(id) {
  await fetch(API + "/archive/" + id, {
    method: "PUT"
  });
  loadQuiz();
  loadArchive();
}

// Delete Active Quiz
async function deleteQuiz(id) {
  if (!confirm("Delete Quiz ?")) return;

  await fetch(API + "/quiz/" + id, {
    method: "DELETE"
  });
  loadQuiz();
}

// Load Archived Quizzes
async function loadArchive() {
  const res = await fetch(API + "/archive");
  const data = await res.json();
  archiveQuiz.innerHTML = "";

  data.forEach((q) => {
    archiveQuiz.innerHTML += `
        <div style="border:1px solid gray;padding:10px;margin:10px;">
          <b>${q.title}</b>
          <br>
          Topic : ${q.topic}
          <br>
          Questions : ${q.questions.length}
          <br><br>
          <button onclick="reuseQuiz('${q._id}')">Reuse</button>
          <button onclick="deleteArchive('${q._id}')">Delete</button>
        </div>
    `;
  });
}

// Reuse Quiz from Archive
async function reuseQuiz(id) {
  await fetch(API + "/reuse/" + id, {
    method: "PUT"
  });
  loadArchive();
  loadQuiz();
}

// Delete Archived Quiz
async function deleteArchive(id) {
  if (!confirm("Delete Archive?")) return;

  await fetch(API + "/quiz/" + id, {
    method: "DELETE"
  });
  loadArchive();
}

// Load Leaderboard Data
async function loadLeaderboard() {
  if (!leaderboard) return;
  const res = await fetch(API + "/leaderboard");
  const data = await res.json();
  leaderboard.innerHTML = "";

  data.forEach((user, index) => {
    leaderboard.innerHTML += `
      <div style="border:1px solid #ddd;padding:5px;margin:5px;">
        <b>#${index + 1} ${user.name}</b> - Score: ${user.score}
      </div>
    `;
  });
}

function exportLeaderboard() {
  
  html2canvas(leaderboard).then(canvas => {
    
    const link = document.createElement("a");
    
    link.download = "leaderboard.png";
    
    link.href = canvas.toDataURL();
    
    link.click();
    
  });
  
}
// Initial Page Load Calls
loadQuiz();
loadArchive();
loadLeaderboard();

const API = "/api/questions";

// पेज खुलते ही प्रश्न लोड करें
window.onload = () => {
  loadQuestions();
};

// =======================
// Save Question
// =======================

async function saveQuestion() {
  
  const today = new Date().toISOString().slice(0, 10);
  
  const body = {
    
    quizTitle: document.getElementById("quizTitle").value,
    
    quizDate: today,
    
    questionHindi: document.getElementById("questionHindi").value,
    
    questionEnglish: document.getElementById("questionEnglish").value,
    
    options: [
      
      {
        hi: document.getElementById("a_hi").value,
        en: document.getElementById("a_en").value
      },
      
      {
        hi: document.getElementById("b_hi").value,
        en: document.getElementById("b_en").value
      },
      
      {
        hi: document.getElementById("c_hi").value,
        en: document.getElementById("c_en").value
      },
      
      {
        hi: document.getElementById("d_hi").value,
        en: document.getElementById("d_en").value
      }
      
    ],
    
    answer: Number(
      document.getElementById("answer").value
    ),
    
    published: true
    
  };
  
  const res = await fetch(API, {
    
    method: "POST",
    
    headers: {
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify(body)
    
  });
  
  const data = await res.json();
  
  if (data.success) {
    
    alert("Question Saved");
    
    document
      .querySelectorAll("input,textarea")
      .forEach(e => {
        
        if (e.id != "quizTitle")
          e.value = "";
        
      });
    
    loadQuestions();
    
  } else {
    
    alert(data.error);
    
  }
  
}

// =======================
// Load Questions
// =======================

async function loadQuestions() {
  
  const res = await fetch(API);
  
  const data = await res.json();
  
  let html = "";
  
  data.forEach((q, index) => {
    
    html += `

<div class="question-card">

<b>Q${index+1}</b><br><br>

${q.questionHindi}<br>

${q.questionEnglish}

<br><br>

<button
class="delete"
onclick="deleteQuestion('${q._id}')">

Delete

</button>

</div>

`;
    
  });
  
  document.getElementById("list").innerHTML = html;
  
}

// =======================
// Delete
// =======================

async function deleteQuestion(id) {
  
  if (!confirm("Delete Question?"))
    return;
  
  await fetch(API + "/" + id, {
    
    method: "DELETE"
    
  });
  
  loadQuestions();
  
}
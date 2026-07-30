const API = "/api/questions/archive";

window.onload = loadArchive;


// ==========================
// LOAD ARCHIVE
// ==========================

async function loadArchive() {
  
  try {
    
    const res = await fetch(API);
    
    const data = await res.json();
    
    let html = "";
    
    if (data.length === 0) {
      
      html = "<h3>No Archive Found</h3>";
      
    }
    
    data.forEach(item => {
      
      html += `

<div class="archive-card">

<div>

<h3>📅 ${item.quizDate}</h3>

<p>

Questions : ${item.totalQuestions}

</p>

</div>

<div>

<button

class="view"

onclick="viewArchive('${item.quizDate}')">

👁 View

</button>

<button

style="background:#2e7d32"

onclick="reuseQuiz('${item.quizDate}')">

♻️ Reuse

</button>

<button

class="delete"

onclick="deleteArchive('${item.quizDate}')">

🗑 Delete

</button>

</div>

</div>

`;
      
    });
    
    document.getElementById("archiveList").innerHTML = html;
    
  }
  
  catch (err) {
    
    console.log(err);
    
    document.getElementById("archiveList").innerHTML =
      
      "<h3>Server Error</h3>";
    
  }
  
}



// ==========================
// VIEW ARCHIVE
// ==========================

function viewArchive(date) {
  
  location.href =
    
    "archive-view.html?date=" + date;
  
}



// ==========================
// DELETE ARCHIVE
// ==========================

async function deleteArchive(date) {
  
  if (!confirm(
      
      date +
      
      "\n\nइस तारीख के सभी प्रश्न Delete करना चाहते हैं?"
      
    )) return;
  
  const res = await fetch(
    
    "/api/questions/archive/" + date,
    
    {
      
      method: "DELETE"
      
    }
    
  );
  
  const data = await res.json();
  
  alert(data.message);
  
  loadArchive();
  
}
// ==========================
// REUSE QUIZ
// ==========================

async function reuseQuiz(date) {
  
  if (!confirm(
      
      date +
      
      "\n\nक्या इस Quiz को आज की Date में Copy करना चाहते हैं?"
      
    )) return;
  
  const res = await fetch(
    
    "/api/questions/reuse/" + date,
    
    {
      
      method: "POST"
      
    }
    
  );
  
  const data = await res.json();
  
  alert(data.message);
  
}
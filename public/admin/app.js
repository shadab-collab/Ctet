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
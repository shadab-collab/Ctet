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
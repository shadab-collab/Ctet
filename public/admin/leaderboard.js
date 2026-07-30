// ===========================
// LEADERBOARD
// leaderboard.js
// ===========================


// ===========================
// RESET LEADERBOARD
// ===========================

async function resetLeaderboard() {
  
  const ok = confirm(
    
    "क्या आप Leaderboard Reset करना चाहते हैं?\n\nयह कार्य वापस नहीं किया जा सकता।"
    
  );
  
  if (!ok) return;
  
  try {
    
    const res = await fetch(
      
      "/api/results/reset",
      
      {
        
        method: "DELETE"
        
      }
      
    );
    
    const data = await res.json();
    
    if (data.success) {
      
      alert(
        
        "✅ Leaderboard Reset Successfully"
        
      );
      
    }
    
    else {
      
      alert(
        
        data.error ||
        
        "Reset Failed"
        
      );
      
    }
    
  }
  
  catch (err) {
    
    console.log(err);
    
    alert("Server Error");
    
  }
  
}



// ===========================
// CANCEL EDIT
// ===========================

function cancelEdit() {
  
  editingId = null;
  
  clearForm();
  
}



// ===========================
// REFRESH QUESTION LIST
// ===========================

function refreshQuestions() {
  
  loadQuestions();
  
}



// ===========================
// RELOAD PAGE
// ===========================

function reloadPage() {
  
  location.reload();
  
}
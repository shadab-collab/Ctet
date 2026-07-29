const API = "/api/questions/archive";


window.onload = loadArchive;



// ==========================
// LOAD ARCHIVE
// ==========================

async function loadArchive() {
  
  try {
    
    
    const res =
      await fetch(API);
    
    
    const data =
      await res.json();
    
    
    
    if (!data.length) {
      
      document
        .getElementById("archiveList")
        .innerHTML =
        "<h3>No Archive Found</h3>";
      
      return;
      
    }
    
    
    
    document
      .getElementById("archiveList")
      .innerHTML =
      
      
      data.map(item => `

        <div class="archive-card">


            <div>

                <h3>
                📅 ${item.quizDate}
                </h3>


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
                class="delete"
                onclick="deleteArchive('${item.quizDate}')">

                🗑 Delete

                </button>


            </div>


        </div>


        `).join("");
    
    
    
  }
  catch (err) {
    
    console.log(err);
    
    document
      .getElementById("archiveList")
      .innerHTML =
      "<h3>Server Error</h3>";
    
  }
  
}



// ==========================
// VIEW
// ==========================

function viewArchive(date) {
  
  location.href =
    "archive-view.html?date=" + date;
  
}



// ==========================
// DELETE
// ==========================

async function deleteArchive(date) {
  
  
  if (!confirm(
      date +
      "\n\nइस तारीख के सभी प्रश्न Delete करें?"
    ))
    
    return;
  
  
  
  try {
    
    
    const res =
      await fetch(
        
        "/api/questions/archive/" + date,
        
        {
          method: "DELETE"
        }
        
      );
    
    
    const data =
      await res.json();
    
    
    alert(data.message);
    
    
    loadArchive();
    
    
  }
  catch (err) {
    
    console.log(err);
    
    alert("Delete Failed");
    
  }
  
  
}
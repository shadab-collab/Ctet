const API = "/api/questions";

window.onload = () => {
  
  loadQuestions();
  
};

// ===========================
// AUTO FILL
// ===========================

function autoFillQuestion() {
  
  const text = document
    .getElementById("bulkInput")
    .value;
  
  function find(start, end) {
    
    const s = text.indexOf(start);
    
    if (s == -1) return "";
    
    const from = s + start.length;
    
    const e = text.indexOf(end, from);
    
    if (e == -1)
      return text.substring(from).trim();
    
    return text.substring(from, e).trim();
    
  }
  
  document.getElementById("questionHindi").value =
    
    find(
      "Question Hindi:",
      "Question English:"
    );
  
  document.getElementById("questionEnglish").value =
    
    find(
      "Question English:",
      "A Hindi:"
    );
  
  document.getElementById("a_hi").value =
    
    find(
      "A Hindi:",
      "A English:"
    );
  
  document.getElementById("a_en").value =
    
    find(
      "A English:",
      "B Hindi:"
    );
  
  document.getElementById("b_hi").value =
    
    find(
      "B Hindi:",
      "B English:"
    );
  
  document.getElementById("b_en").value =
    
    find(
      "B English:",
      "C Hindi:"
    );
  
  document.getElementById("c_hi").value =
    
    find(
      "C Hindi:",
      "C English:"
    );
  
  document.getElementById("c_en").value =
    
    find(
      "C English:",
      "D Hindi:"
    );
  
  document.getElementById("d_hi").value =
    
    find(
      "D Hindi:",
      "D English:"
    );
  
  document.getElementById("d_en").value =
    
    find(
      "D English:",
      "Answer:"
    );
  
  const ans =
    
    find(
      "Answer:",
      ""
    )
    .trim()
    .toUpperCase();
  
  let index = 0;
  
  if (ans === "A") index = 0;
  if (ans === "B") index = 1;
  if (ans === "C") index = 2;
  if (ans === "D") index = 3;
  
  document
    .getElementById("answer")
    .value = index;
  
}
// ===========================
// SAVE QUESTION
// ===========================

async function saveQuestion(){

    const today =
    new Date().toISOString().slice(0,10);

    const body={

        quizTitle:
        document.getElementById("quizTitle").value.trim(),

        quizDate:today,

        questionHindi:
        document.getElementById("questionHindi").value.trim(),

        questionEnglish:
        document.getElementById("questionEnglish").value.trim(),

        options:[

            {

                hi:
                document.getElementById("a_hi").value.trim(),

                en:
                document.getElementById("a_en").value.trim()

            },

            {

                hi:
                document.getElementById("b_hi").value.trim(),

                en:
                document.getElementById("b_en").value.trim()

            },

            {

                hi:
                document.getElementById("c_hi").value.trim(),

                en:
                document.getElementById("c_en").value.trim()

            },

            {

                hi:
                document.getElementById("d_hi").value.trim(),

                en:
                document.getElementById("d_en").value.trim()

            }

        ],

        answer:Number(
            document.getElementById("answer").value
        ),

        published:true

    };

    const res=await fetch(API,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(body)

    });

    const data=await res.json();

    if(data.success){

        alert("Question Saved Successfully");

        clearForm();

        loadQuestions();

    }else{

        alert(data.error);

    }

}



// ===========================
// CLEAR FORM
// ===========================

function clearForm(){

    document.getElementById("bulkInput").value="";

    document.getElementById("questionHindi").value="";

    document.getElementById("questionEnglish").value="";

    document.getElementById("a_hi").value="";

    document.getElementById("a_en").value="";

    document.getElementById("b_hi").value="";

    document.getElementById("b_en").value="";

    document.getElementById("c_hi").value="";

    document.getElementById("c_en").value="";

    document.getElementById("d_hi").value="";

    document.getElementById("d_en").value="";

    document.getElementById("answer").value="0";

}
// ===========================
// LOAD QUESTIONS
// ===========================

async function loadQuestions() {
  
  try {
    
    const res = await fetch(API);
    
    const data = await res.json();
    
    let html = "";
    
    data.forEach((q, index) => {
      
      html += `

            <div class="question-card">

                <h4>Question ${index+1}</h4>

                <p><b>Hindi :</b><br>${q.questionHindi}</p>

                <p><b>English :</b><br>${q.questionEnglish}</p>

                <hr>

                <button onclick="editQuestion('${q._id}')">

                    Edit

                </button>

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
  
  catch (err) {
    
    console.log(err);
    
  }
  
}



// ===========================
// DELETE QUESTION
// ===========================

async function deleteQuestion(id) {
  
  if (!confirm("Delete this question?"))
    return;
  
  await fetch(API + "/" + id, {
    
    method: "DELETE"
    
  });
  
  loadQuestions();
  
}



// ===========================
// EDIT QUESTION
// ===========================

async function editQuestion(id) {
  
  const res = await fetch(API);
  
  const data = await res.json();
  
  const q = data.find(item => item._id === id);
  
  if (!q) return;
  
  document.getElementById("questionHindi").value =
    q.questionHindi;
  
  document.getElementById("questionEnglish").value =
    q.questionEnglish;
  
  document.getElementById("a_hi").value =
    q.options[0].hi;
  
  document.getElementById("a_en").value =
    q.options[0].en;
  
  document.getElementById("b_hi").value =
    q.options[1].hi;
  
  document.getElementById("b_en").value =
    q.options[1].en;
  
  document.getElementById("c_hi").value =
    q.options[2].hi;
  
  document.getElementById("c_en").value =
    q.options[2].en;
  
  document.getElementById("d_hi").value =
    q.options[3].hi;
  
  document.getElementById("d_en").value =
    q.options[3].en;
  
  document.getElementById("answer").value =
    q.answer;
  
  // पुराना प्रश्न हटाएँ ताकि Save करने पर अपडेट जैसा व्यवहार हो
  await fetch(API + "/" + id, {
    method: "DELETE"
  });
  
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  
}
// ===================================
// BULK IMPORT
// ===================================

async function bulkImport() {

    const text = document
        .getElementById("bulkInput")
        .value
        .trim();

    if (!text) {
        alert("पहले प्रश्न Paste करें");
        return;
    }

    // प्रत्येक प्रश्न को ====== से अलग करें
    const blocks = text.split("======");

    let saved = 0;

    for (const block of blocks) {

        if (!block.trim()) continue;

        const body = parseQuestion(block);

        if (!body) continue;

        await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)

        });

        saved++;

    }

    alert(saved + " Questions Imported Successfully");

    document.getElementById("bulkInput").value = "";

    loadQuestions();

}



// ===================================
// PARSER
// ===================================

function parseQuestion(text){

    function find(start,end){

        const s=text.indexOf(start);

        if(s==-1) return "";

        const from=s+start.length;

        const e=end
            ? text.indexOf(end,from)
            : -1;

        if(e==-1)
            return text.substring(from).trim();

        return text.substring(from,e).trim();

    }

    const ans=find("Answer:","").toUpperCase();

    let index=0;

    if(ans=="B") index=1;
    if(ans=="C") index=2;
    if(ans=="D") index=3;

    return{

        quizTitle:
        document.getElementById("quizTitle").value,

        quizDate:
        new Date().toISOString().slice(0,10),

        questionHindi:
        find("Question Hindi:","Question English:"),

        questionEnglish:
        find("Question English:","A Hindi:"),

        options:[

            {
                hi:find("A Hindi:","A English:"),
                en:find("A English:","B Hindi:")
            },

            {
                hi:find("B Hindi:","B English:"),
                en:find("B English:","C Hindi:")
            },

            {
                hi:find("C Hindi:","C English:"),
                en:find("C English:","D Hindi:")
            },

            {
                hi:find("D Hindi:","D English:"),
                en:find("D English:","Answer:")
            }

        ],

        answer:index,

        published:true

    };

}
// ===========================
// RESET LEADERBOARD
// ===========================

async function resetLeaderboard() {
  
  const ok = confirm(
    "क्या आप Leaderboard Reset करना चाहते हैं?\n\nयह कार्य वापस नहीं किया जा सकता।"
  );
  
  if (!ok) return;
  
  try {
    
    const res = await fetch("/api/results/reset", {
      
      method: "DELETE"
      
    });
    
    const data = await res.json();
    
    if (data.success) {
      
      alert("✅ Leaderboard Reset Successfully");
      
    } else {
      
      alert(data.error || "Reset Failed");
      
    }
    
  }
  
  catch (err) {
    
    console.log(err);
    
    alert("Server Error");
    
  }
  
}
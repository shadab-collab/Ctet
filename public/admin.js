const API = "/api/admin";

let questions = [];
let editIndex = -1;

const quizTitle = document.getElementById("quizTitle");
const topic = document.getElementById("topic");
const bulkText = document.getElementById("bulkText");

const questionList = document.getElementById("questionList");
const activeQuiz = document.getElementById("activeQuiz");
const archiveQuizDiv = document.getElementById("archiveQuiz");
const leaderboard = document.getElementById("leaderboard");

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

function getValue(block, label) {
  
  const regex = new RegExp(label + "\\s*([\\s\\S]*?)(?=\\n[A-Za-z ]+:|$)");
  
  const match = block.match(regex);
  
  return match ? match[1].trim() : "";
  
}

function importQuestions() {
  
  questions = [];
  
  const text = bulkText.value.trim();
  
  const blocks = text.match(/Question Hindi:[\s\S]*?(?=Question Hindi:|$)/g) || [];
  
  blocks.forEach(block => {
    
    const answer = getValue(block, "Answer:").toUpperCase();
    
    questions.push({
      
      questionHindi: getValue(block, "Question Hindi:"),
      
      questionEnglish: getValue(block, "Question English:"),
      
      options: [
        
        {
          hi: getValue(block, "A Hindi:"),
          en: getValue(block, "A English:")
        },
        
        {
          hi: getValue(block, "B Hindi:"),
          en: getValue(block, "B English:")
        },
        
        {
          hi: getValue(block, "C Hindi:"),
          en: getValue(block, "C English:")
        },
        
        {
          hi: getValue(block, "D Hindi:"),
          en: getValue(block, "D English:")
        }
        
      ],
      
      answer: {
        A: 0,
        B: 1,
        C: 2,
        D: 3
      } [answer]
      
    });
    
  });
  
  showQuestions();
  
  alert(questions.length + " Questions Imported");
  
}

function showQuestions() {
  
  questionList.innerHTML = "";
  
  questions.forEach((q, index) => {
    
    questionList.innerHTML += `

<div style="background:white;padding:10px;margin:10px;border-radius:6px;border:1px solid #ddd;">

<b>Q${index+1}</b>

<p>${q.questionHindi}</p>

<p>A. ${q.options[0].hi}</p>

<p>B. ${q.options[1].hi}</p>

<p>C. ${q.options[2].hi}</p>

<p>D. ${q.options[3].hi}</p>

<p><b>Answer :
${["A","B","C","D"][q.answer]}</b></p>

<button onclick="editQuestion(${index})">

Edit

</button>

<button onclick="deleteQuestion(${index})">

Delete

</button>

</div>

`;
    
  });
  
}

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
  
  window.scrollTo({
    top: editBox.offsetTop,
    behavior: "smooth"
  });
  
}

function updateQuestion() {
  
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
  } [ans.value];
  
  editBox.style.display = "none";
  
  showQuestions();
  
}

function deleteQuestion(index) {
  
  if (!confirm("Delete Question?")) return;
  
  questions.splice(index, 1);
  
  showQuestions();
  
}
// -------------------- SAVE QUIZ --------------------

async function saveQuiz(){

    if(quizTitle.value.trim()==""){
        alert("Enter Quiz Name");
        return;
    }

    if(topic.value.trim()==""){
        alert("Enter Today's Topic");
        return;
    }

    if(questions.length==0){
        alert("No Questions Imported");
        return;
    }

    try{

        const res=await fetch(API+"/quiz",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title:quizTitle.value.trim(),

                topic:topic.value.trim(),

                questions:questions

            })

        });

        const data=await res.json();

        alert(data.message||"Quiz Saved");

        questions=[];

        bulkText.value="";
        questionList.innerHTML="";

        loadQuiz();

    }catch(err){

        alert(err.message);

    }

}



// -------------------- ACTIVE QUIZ --------------------

async function loadQuiz(){

    const res=await fetch(API+"/quiz");

    const data=await res.json();

    activeQuiz.innerHTML="";

    data.forEach(q=>{

        activeQuiz.innerHTML+=`

<div>

<b>${q.title}</b>

<br>

Topic : ${q.topic}

<br>

Questions : ${q.questions.length}

<br><br>

<button onclick="archiveCurrentQuiz('${q._id}')">

Archive

</button>

<button onclick="deleteQuiz('${q._id}')">

Delete

</button>

</div>

`;

    });

}



// -------------------- ARCHIVE --------------------

async function archiveCurrentQuiz(id){

    await fetch(API+"/archive/"+id,{

        method:"PUT"

    });

    loadQuiz();

    loadArchive();

}



async function loadArchive(){

    const res=await fetch(API+"/archive");

    const data=await res.json();

    archiveQuizDiv.innerHTML="";

    data.forEach(q=>{

archiveQuizDiv.innerHTML+=`

<div>

<b>${q.title}</b>

<br>

Topic : ${q.topic}

<br>

Questions : ${q.questions.length}

<br><br>

<button onclick="reuseQuiz('${q._id}')">

Reuse

</button>

<button onclick="deleteArchive('${q._id}')">

Delete

</button>

</div>

`;

    });

}



// -------------------- REUSE --------------------

async function reuseQuiz(id){

    await fetch(API+"/reuse/"+id,{

        method:"PUT"

    });

    loadArchive();

    loadQuiz();

}



// -------------------- DELETE --------------------

async function deleteQuiz(id){

    if(!confirm("Delete Quiz?")) return;

    await fetch(API+"/quiz/"+id,{

        method:"DELETE"

    });

    loadQuiz();

}



async function deleteArchive(id){

    if(!confirm("Delete Archive?")) return;

    await fetch(API+"/quiz/"+id,{

        method:"DELETE"

    });

    loadArchive();

}



// -------------------- LEADERBOARD --------------------

async function loadLeaderboard(){

    const res=await fetch(API+"/leaderboard");

    const data=await res.json();

    leaderboard.innerHTML="";

    data.forEach((u,index)=>{

leaderboard.innerHTML+=`

<div>

<b>

${index+1}.

${u.studentName||u.name}

</b>

<br>

Score :

${u.score}/${u.total}

</div>

`;

    });

}



// -------------------- RESET --------------------

async function resetLeaderboard(){

    if(!confirm("Reset Leaderboard?")) return;

    await fetch(API+"/leaderboard/reset",{

        method:"DELETE"

    });

    loadLeaderboard();

}



// -------------------- EXPORT --------------------

function exportLeaderboard(){

    html2canvas(leaderboard).then(canvas=>{

        const a=document.createElement("a");

        a.download="leaderboard.png";

        a.href=canvas.toDataURL();

        a.click();

    });

}



// -------------------- PAGE LOAD --------------------

loadQuiz();

loadArchive();

loadLeaderboard();
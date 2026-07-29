// ===========================
// REUSE QUESTIONS
// reuse.js
// ===========================

// OPEN MODAL

async function openReuseModal() {
  
  document.getElementById("reuseModal").style.display =
    "block";
  
  const res = await fetch("/api/quiz");
  
  const quizzes = await res.json();
  
  const currentQuiz =
    document.getElementById("quizList").value;
  
  let html = "";
  
  quizzes.forEach(q => {
    
    if (q.quizId !== currentQuiz) {
      
      html += `

            <option value="${q.quizId}">

                ${q.quizName}

                (${q.questionCount || 0})

            </option>

            `;
      
    }
    
  });
  
  document.getElementById("reuseQuizList").innerHTML =
    html;
  
  loadReuseQuestions();
  
}

// CLOSE MODAL

function closeReuseModal() {
  
  document.getElementById("reuseModal").style.display =
    "none";
  
}
// ===========================
// SOURCE QUIZ CHANGE
// ===========================

document
  .getElementById("reuseQuizList")
  .addEventListener(
    "change",
    loadReuseQuestions
  );
  
  // ===========================
// LOAD REUSE QUESTIONS
// ===========================

async function loadReuseQuestions() {
  
  const quizId =
    document.getElementById("reuseQuizList").value;
  
  if (!quizId) {
    
    document.getElementById(
      "reuseQuestionList"
    ).innerHTML = "";
    
    return;
    
  }
  
  try {
    
    const res = await fetch(
      
      "/api/questions/reuse/" + quizId
      
    );
    
    const data = await res.json();
    
    if (!data.success) {
      
      alert(data.error);
      
      return;
      
    }
    
    let html = "";
    
    data.questions.forEach((q, index) => {
      
      html += `

            <label
            style="
                display:block;
                padding:10px;
                margin-bottom:8px;
                border:1px solid #ddd;
                border-radius:8px;
            ">

                <input

                    type="checkbox"

                    class="reuseQuestion"

                    value="${q._id}"

                >

                <b>

                    Q${index + 1}

                </b>

                <br><br>

                ${q.questionHindi}

                <br>

                <small>

                    ${q.questionEnglish}

                </small>

            </label>

            `;
      
    });
    
    document.getElementById(
      "reuseQuestionList"
    ).innerHTML = html;
    
  }
  
  catch (err) {
    
    console.log(err);
    
    alert("Questions Load Failed");
    
  }
  
}
// ===========================
// COPY SELECTED QUESTIONS
// ===========================

async function copySelectedQuestions() {

    const targetQuizId =
        document.getElementById("quizList").value;

    if (!targetQuizId) {

        alert("Target Quiz Select करें");

        return;

    }

    const questionIds = [

        ...document.querySelectorAll(

            ".reuseQuestion:checked"

        )

    ].map(x => x.value);

    if (questionIds.length === 0) {

        alert("कम से कम एक Question चुनिए");

        return;

    }

    try {

        const res = await fetch(

            "/api/questions/reuse",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    targetQuizId,

                    questionIds

                })

            }

        );

        const data = await res.json();

        alert(data.message);

        closeReuseModal();

        loadQuestions();

        loadQuizList();

        loadDashboard();

    }

    catch (err) {

        console.log(err);

        alert("Copy Failed");

    }

}
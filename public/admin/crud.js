// ===========================
// CRUD
// crud.js
// ===========================


// ===========================
// SAVE QUESTION
// ===========================

async function saveQuestion(){

    const body={

        quizTitle:value("quizTitle"),

        quizDate:getToday(),

        questionHindi:value("questionHindi"),

        questionEnglish:value("questionEnglish"),

        options:[

            {

                hi:value("a_hi"),

                en:value("a_en")

            },

            {

                hi:value("b_hi"),

                en:value("b_en")

            },

            {

                hi:value("c_hi"),

                en:value("c_en")

            },

            {

                hi:value("d_hi"),

                en:value("d_en")

            }

        ],

        answer:Number(

            document
            .getElementById("answer")
            .value

        ),

        published:true

    };


    const url = editingId

        ? API + "/" + editingId

        : API;


    const method = editingId

        ? "PUT"

        : "POST";


    const res = await fetch(url,{

        method:method,

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(body)

    });


    const data = await res.json();


    if(data.success){

        alert(

            editingId

            ? "Question Updated Successfully"

            : "Question Saved Successfully"

        );

        stopEditing();

        clearForm();

        loadQuestions();

    }

    else{

        alert(

            data.error ||

            "Save Failed"

        );

    }

}



// ===========================
// CLEAR FORM
// ===========================

function clearForm(){

    setValue("bulkInput","");

    setValue("quizTitle","");

    setValue("questionHindi","");

    setValue("questionEnglish","");

    setValue("a_hi","");

    setValue("a_en","");

    setValue("b_hi","");

    setValue("b_en","");

    setValue("c_hi","");

    setValue("c_en","");

    setValue("d_hi","");

    setValue("d_en","");

    document
        .getElementById("answer")
        .value = 0;

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

                <p>
                    <b>Hindi :</b><br>
                    ${q.questionHindi}
                </p>

                <p>
                    <b>English :</b><br>
                    ${q.questionEnglish}
                </p>

                <hr>

                <button
                    onclick="editQuestion('${q._id}')">

                    ✏️ Edit

                </button>

                <button
                    class="delete"
                    onclick="deleteQuestion('${q._id}')">

                    🗑 Delete

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
// EDIT QUESTION
// ===========================

async function editQuestion(id) {
  
  try {
    
    const res = await fetch(API);
    
    const data = await res.json();
    
    const q = data.find(item => item._id === id);
    
    if (!q) {
      
      alert("Question Not Found");
      
      return;
      
    }
    
    editingId = id;
    
    setValue("quizTitle", q.quizTitle || "");
    
    setValue("questionHindi", q.questionHindi);
    
    setValue("questionEnglish", q.questionEnglish);
    
    setValue("a_hi", q.options[0].hi);
    
    setValue("a_en", q.options[0].en);
    
    setValue("b_hi", q.options[1].hi);
    
    setValue("b_en", q.options[1].en);
    
    setValue("c_hi", q.options[2].hi);
    
    setValue("c_en", q.options[2].en);
    
    setValue("d_hi", q.options[3].hi);
    
    setValue("d_en", q.options[3].en);
    
    document.getElementById("answer").value = q.answer;
    
    scrollTopForm();
    
  }
  
  catch (err) {
    
    console.log(err);
    
  }
  
}



// ===========================
// DELETE QUESTION
// ===========================

async function deleteQuestion(id) {
  
  if (!confirm("Delete this Question?"))
    
    return;
  
  try {
    
    const res = await fetch(API + "/" + id, {
      
      method: "DELETE"
      
    });
    
    const data = await res.json();
    
    if (data.success) {
      
      alert("Question Deleted");
      
      loadQuestions();
      
    }
    
    else {
      
      alert(data.error || "Delete Failed");
      
    }
    
  }
  
  catch (err) {
    
    console.log(err);
    
  }
  
}
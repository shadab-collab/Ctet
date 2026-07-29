// ===========================
// CRUD
// crud.js
// ===========================


async function saveQuestion() {
    
    const quizId = document.getElementById("quizList").value;
    
    if (!quizId) {
        alert("पहले Quiz Select करें");
        return;
    }
    
    
    const body = {
        
        quizId,
        
        quizTitle: value("quizTitle"),
        
        quizDate: getToday(),
        
        questionHindi: value("questionHindi"),
        
        questionEnglish: value("questionEnglish"),
        
        options: [
            
            {
                hi: value("a_hi"),
                en: value("a_en")
            },
            
            {
                hi: value("b_hi"),
                en: value("b_en")
            },
            
            {
                hi: value("c_hi"),
                en: value("c_en")
            },
            
            {
                hi: value("d_hi"),
                en: value("d_en")
            }
            
        ],
        
        answer: Number(
            document.getElementById("answer").value
        ),
        
        published: true
        
    };
    
    
    const url = editingId ?
        API + "/" + editingId :
        API;
    
    
    const method = editingId ?
        "PUT" :
        "POST";
    
    
    try {
        
        const res = await fetch(url, {
            
            method,
            
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify(body)
            
        });
        
        
        const data = await res.json();
        
        
        if (data.success) {
            
            alert(
                editingId ?
                "Question Updated" :
                "Question Saved"
            );
            
            
            stopEditing();
            
            clearForm();
            
            loadQuestions();
            
            loadQuizList();
            
            loadDashboard();
            
        }
        else {
            
            alert(data.error || "Save Failed");
            
        }
        
        
    }
    catch (err) {
        
        console.log(err);
        
        alert("Server Error");
        
    }
    
}



// ===========================
// CLEAR FORM
// ===========================

function clearForm() {
    
    [
        
        "bulkInput",
        "quizTitle",
        "questionHindi",
        "questionEnglish",
        "a_hi",
        "a_en",
        "b_hi",
        "b_en",
        "c_hi",
        "c_en",
        "d_hi",
        "d_en"
        
    ].forEach(id => setValue(id, ""));
    
    
    document.getElementById("answer").value = 0;
    
}



// ===========================
// LOAD QUESTIONS
// ===========================

async function loadQuestions() {
    
    const quizId =
        document.getElementById("quizList").value;
    
    
    if (!quizId) {
        
        document.getElementById("list").innerHTML = "";
        
        return;
        
    }
    
    
    try {
        
        
        const res = await fetch(
            API + "?quizId=" + quizId
        );
        
        
        const data = await res.json();
        
        
        let html = "";
        
        
        data.forEach((q, index) => {
            
            
            html += `

            <div class="question-card">

            <h4>Question ${index+1}</h4>

            <p>
            <b>Hindi:</b><br>
            ${q.questionHindi}
            </p>


            <p>
            <b>English:</b><br>
            ${q.questionEnglish}
            </p>


            <button onclick="editQuestion('${q._id}')">
            ✏️ Edit
            </button>


            <button class="delete"
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

async function editQuestion(id){

    const quizId =
        document.getElementById("quizList").value;


    if(!quizId){

        alert("पहले Quiz Select करें");

        return;

    }


    try{


        const res = await fetch(
            API + "?quizId=" + quizId
        );


        const data = await res.json();


        const q = data.find(
            item => item._id === id
        );


        if(!q){

            alert("Question Not Found");

            return;

        }


        editingId = id;


        setValue(
            "quizTitle",
            q.quizTitle || ""
        );


        setValue(
            "questionHindi",
            q.questionHindi
        );


        setValue(
            "questionEnglish",
            q.questionEnglish
        );


        setValue(
            "a_hi",
            q.options[0].hi
        );


        setValue(
            "a_en",
            q.options[0].en
        );


        setValue(
            "b_hi",
            q.options[1].hi
        );


        setValue(
            "b_en",
            q.options[1].en
        );


        setValue(
            "c_hi",
            q.options[2].hi
        );


        setValue(
            "c_en",
            q.options[2].en
        );


        setValue(
            "d_hi",
            q.options[3].hi
        );


        setValue(
            "d_en",
            q.options[3].en
        );


        document.getElementById("answer").value =
            q.answer;


        scrollTopForm();


    }
    catch(err){

        console.log(err);

    }

}



// ===========================
// DELETE QUESTION
// ===========================

async function deleteQuestion(id){


    if(!confirm("Question Delete करें?"))

        return;



    try{


        const res = await fetch(

            API + "/" + id,

            {
                method:"DELETE"
            }

        );


        const data = await res.json();



        if(data.success){


            alert("Question Deleted");


            loadQuestions();

            loadQuizList();

            loadDashboard();


        }
        else{


            alert(
                data.error ||
                "Delete Failed"
            );


        }



    }
    catch(err){

        console.log(err);

        alert("Server Error");

    }


}
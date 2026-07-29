// ===========================
// APP CONFIG
// ===========================

const API = "/api/questions";

let editingId = null;


// ===========================
// PAGE LOAD
// ===========================

window.addEventListener("load", () => {

    loadTopic();

    loadQuizList();

    loadDashboard();

    loadMergeQuizList();


    document
    .getElementById("quizList")
    .addEventListener(
        "change",
        loadQuestions
    );

});



// ===========================
// COMMON FUNCTIONS
// ===========================

function getToday(){

    return new Date()
    .toISOString()
    .slice(0,10);

}


function value(id){

    return document
    .getElementById(id)
    .value
    .trim();

}


function setValue(id,text){

    document
    .getElementById(id)
    .value = text;

}


function stopEditing(){

    editingId = null;

}


function scrollTopForm(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



// ===========================
// TOPIC
// ===========================

async function loadTopic(){

    try{

        const res =
        await fetch("/api/topic");

        const data =
        await res.json();


        document
        .getElementById("todayTopic")
        .value = data.title || "";


    }
    catch(err){

        console.log(err);

    }

}



async function saveTopic(){

    const title =
    value("todayTopic");


    if(!title){

        alert("Topic लिखें");

        return;

    }


    try{


        const res =
        await fetch(
            "/api/topic",
            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    title
                })

            }
        );


        const data =
        await res.json();


        alert(data.message);


    }
    catch(err){

        console.log(err);

        alert("Topic Save Failed");

    }

}



// ===========================
// LOAD QUIZ LIST
// ===========================

async function loadQuizList(){

    try{


        const res =
        await fetch("/api/quiz");


        const quizzes =
        await res.json();



        document
        .getElementById("quizList")
        .innerHTML =

        quizzes.map(q=>`

        <option value="${q.quizId}">

        ${q.isLive ? "🟢 " : ""}

        ${q.quizName}

        (${q.questionCount || 0})

        </option>

        `).join("");



        if(quizzes.length){

            loadQuestions();

        }


    }
    catch(err){

        console.log(err);

    }

}



// ===========================
// DASHBOARD
// ===========================

async function loadDashboard(){

    try{


        const res =
        await fetch("/api/quiz");


        const quizzes =
        await res.json();


        let total = 0;

        let live = "None";



        quizzes.forEach(q=>{


            total += q.questionCount || 0;


            if(q.isLive){

                live = q.quizName;

            }


        });



        document
        .getElementById("totalQuiz")
        .innerText = quizzes.length;


        document
        .getElementById("totalQuestions")
        .innerText = total;


        document
        .getElementById("liveQuiz")
        .innerText = live;



    }
    catch(err){

        console.log(err);

    }

}



// ===========================
// CREATE QUIZ
// ===========================

async function createQuiz(){

    const quizName =
    value("newQuizName");


    const topic =
    value("newQuizTopic");



    if(!quizName){

        alert("Quiz Name लिखिए");

        return;

    }


    try{


        const quizId =
        Date.now().toString();



        const res =
        await fetch(
            "/api/quiz",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    quizId,

                    quizName,

                    quizDate:getToday(),

                    topic,

                    isLive:false

                })

            }
        );



        const data =
        await res.json();



        if(!data.success){

            alert(data.error);

            return;

        }



        alert("Quiz Created");


        await loadQuizList();


        document
        .getElementById("quizList")
        .value = quizId;



        loadQuestions();



        setValue("newQuizName","");

        setValue("newQuizTopic","");



    }
    catch(err){

        console.log(err);

        alert("Quiz Create Failed");

    }

}
// ===========================
// MAKE LIVE QUIZ
// ===========================

async function makeLiveQuiz(){

    const quizId =
    value("quizList");


    if(!quizId){

        alert("Select Quiz");

        return;

    }


    try{


        const res =
        await fetch(
            "/api/quiz/live/" + quizId,
            {
                method:"PUT"
            }
        );


        const data =
        await res.json();


        alert(data.message);


        loadQuizList();

        loadDashboard();


    }
    catch(err){

        console.log(err);

        alert("Live Quiz Failed");

    }

}



// ===========================
// MERGE QUIZ LIST
// ===========================

async function loadMergeQuizList(){

    try{


        const res =
        await fetch("/api/quiz");


        const quizzes =
        await res.json();



        document
        .getElementById("mergeQuizList")
        .innerHTML =


        quizzes.map(q=>`

        <label style="display:block;margin:8px 0">

        <input
        type="checkbox"
        value="${q.quizId}">

        ${q.quizName}

        </label>

        `).join("");



    }
    catch(err){

        console.log(err);

    }

}



// ===========================
// MERGE QUIZ
// ===========================

async function mergeQuiz(){

    const checked = [

        ...document
        .querySelectorAll(
            "#mergeQuizList input:checked"
        )

    ];



    if(checked.length < 2){

        alert("कम से कम 2 Quiz चुनिए");

        return;

    }



    const quizIds =
    checked.map(x=>x.value);



    const quizName =
    value("mergeQuizName");



    if(!quizName){

        alert("Quiz Name लिखिए");

        return;

    }



    try{


        const res =
        await fetch(
            "/api/quiz/merge",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    quizIds,

                    quizName

                })

            }
        );


        const data =
        await res.json();



        alert(data.message);



        loadQuizList();

        loadMergeQuizList();

        loadDashboard();



    }
    catch(err){

        console.log(err);

    }

}



// ===========================
// RENAME QUIZ
// ===========================

async function renameQuiz(){

    const quizId =
    value("quizList");



    if(!quizId){

        alert("Select Quiz");

        return;

    }



    const newName =
    prompt("New Quiz Name");



    if(!newName) return;



    try{


        const quizzes =
        await fetch("/api/quiz")
        .then(r=>r.json());



        const quiz =
        quizzes.find(
            q=>q.quizId === quizId
        );



        if(!quiz){

            alert("Quiz Not Found");

            return;

        }



        const res =
        await fetch(
            "/api/quiz/" + quiz._id,
            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    quizName:newName

                })

            }
        );



        const data =
        await res.json();



        alert(data.message);



        loadQuizList();



    }
    catch(err){

        console.log(err);

    }

}



// ===========================
// REFRESH
// ===========================

function refreshQuestions(){

    loadQuestions();

}



function reloadPage(){

    location.reload();

}
// ===========================
// BULK IMPORT
// bulk-import.js
// ===========================


async function bulkImport(){

    const quizId =
    document.getElementById("quizList").value;


    if(!quizId){

        alert("पहले Quiz Select करें");

        return;

    }


    const text =
    value("bulkInput");


    if(!text){

        alert("पहले प्रश्न Paste करें");

        return;

    }



    const blocks =
    (text.match(/Question Hindi:[\s\S]*?(?=Question Hindi:|$)/g) || [])
    .map(x=>x.trim())
    .filter(Boolean);



    if(!blocks.length){

        alert("कोई Question नहीं मिला");

        return;

    }



    let saved = 0;

    let failed = 0;



    for(const block of blocks){


        try{


            const body =
            parseQuestion(block);



            if(!body.questionHindi){

                failed++;

                continue;

            }



            body.quizId = quizId;



            const res =
            await fetch(
                API,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify(body)

                }
            );



            const data =
            await res.json();



            data.success
            ? saved++
            : failed++;



        }
        catch(err){

            console.log(err);

            failed++;

        }


    }



    alert(

        "Import Completed\n\n" +

        "Saved : " + saved +

        "\nFailed : " + failed

    );



    setValue("bulkInput","");


    loadQuestions();

    loadQuizList();

    loadDashboard();


}
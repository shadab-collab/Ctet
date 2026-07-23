// ===========================
// BULK IMPORT
// bulk-import.js
// ===========================

async function bulkImport(){

    const text = value("bulkInput");

    if(!text){

        alert("पहले प्रश्न Paste करें");

        return;

    }

    const blocks = text
        .split("======")
        .map(item=>item.trim())
        .filter(item=>item.length>0);

    let saved = 0;

    let failed = 0;

    for(const block of blocks){

        try{

            const body = parseQuestion(block);

            if(!body.questionHindi){

                failed++;

                continue;

            }

            const res = await fetch(API,{

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(body)

            });

            const data = await res.json();

            if(data.success){

                saved++;

            }

            else{

                failed++;

            }

        }

        catch(err){

            console.log(err);

            failed++;

        }

    }

    alert(

        "Import Completed\n\n"

        +"Saved : "+saved+"\n"

        +"Failed : "+failed

    );

    clearForm();

    loadQuestions();

}
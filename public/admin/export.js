// ===========================
// EXPORT LEADERBOARD
// ===========================

async function downloadLeaderboard() {

    try {

        const res = await fetch("/api/results");

        const results = await res.json();


        if (!results.length) {

            alert("Leaderboard Empty");

            return;

        }


        results.sort((a,b)=> b.score - a.score);


        const today =
            new Date().toLocaleDateString("en-GB");


        const quizTitle =
            document.getElementById("quizTitle")?.value
            || "CTET LIVE QUIZ";


        let rows = "";


        results.forEach((r,index)=>{


            let rank = index + 1;


            if(rank === 1) rank = "🥇";
            else if(rank === 2) rank = "🥈";
            else if(rank === 3) rank = "🥉";


            rows += `

            <tr>

            <td>${rank}</td>

            <td>${r.name}</td>

            <td>${r.score}</td>

            </tr>

            `;

        });



        const html = `

        <div id="exportCard"

        style="
        width:900px;
        background:white;
        padding:40px;
        font-family:Arial;
        ">


        <div style="
        background:#1565c0;
        color:white;
        padding:25px;
        border-radius:15px;
        text-align:center;
        ">


        <h1>
        🏆 CTET LIVE QUIZ
        </h1>


        <h2>
        ${quizTitle}
        </h2>


        <p>
        📅 ${today}
        </p>


        <p>
        👨‍🎓 Participants : ${results.length}
        </p>


        </div>


        <br>


        <table style="
        width:100%;
        border-collapse:collapse;
        text-align:center;
        ">


        <tr style="
        background:#1565c0;
        color:white;
        ">

        <th>Rank</th>
        <th>Student</th>
        <th>Score</th>

        </tr>


        ${rows}


        </table>


        <br>


        <div style="
        text-align:center;
        padding:20px;
        background:#f5f5f5;
        border-radius:10px;
        ">

        <h2>
        🏆 Congratulations To All Participants 🏆
        </h2>


        <p>
        Keep Learning • Keep Growing • Keep Winning
        </p>


        </div>


        </div>

        `;



        const box = document.createElement("div");

        box.innerHTML = html;

        box.style.position = "fixed";

        box.style.left = "-10000px";


        document.body.appendChild(box);


        const card =
            document.getElementById("exportCard");


        const canvas =
            await html2canvas(card,{
                scale:3,
                backgroundColor:"#ffffff"
            });



        const link =
            document.createElement("a");


        link.download =
            "CTET-Leaderboard-" +
            new Date()
            .toISOString()
            .slice(0,10)
            +
            ".png";


        link.href =
            canvas.toDataURL("image/png");


        link.click();


        document.body.removeChild(box);


    }


    catch(err){

        console.log(err);

        alert("Image Export Failed");

    }

}
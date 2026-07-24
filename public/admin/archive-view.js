const params = new URLSearchParams(window.location.search);

const date = params.get("date");

document.getElementById("title").innerHTML =
  "📅 Quiz Archive : " + date;

loadQuestions();

async function loadQuestions() {
  
  try {
    
    const res = await fetch(
      "/api/questions/archive/" + date
    );
    
    const data = await res.json();
    
    let html = "";
    
    if (data.length == 0) {
      
      html = "<h3>No Questions Found</h3>";
      
    }
    
    data.forEach((q, index) => {
      
      const letters = ["A", "B", "C", "D"];
      
      html += `

<div class="question">

<h3>

Question ${index+1}

</h3>

<br>

<p>

<b>Hindi :</b><br>

${q.questionHindi}

</p>

<br>

<p>

<b>English :</b><br>

${q.questionEnglish}

</p>

<br>

<p>

A. ${q.options[0].hi}

</p>

<p>

B. ${q.options[1].hi}

</p>

<p>

C. ${q.options[2].hi}

</p>

<p>

D. ${q.options[3].hi}

</p>

<div class="answer">

✅ Correct Answer :
${letters[q.answer]}

</div>

</div>

`;
      
    });
    
    document.getElementById("questions").innerHTML = html;
    
  }
  
  catch (err) {
    
    console.log(err);
    
    document.getElementById("questions").innerHTML =
      
      "<h3>Server Error</h3>";
    
  }
  
}
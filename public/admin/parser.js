// ===========================
// PARSER
// parser.js
// ===========================


// ===========================
// AUTO FILL
// ===========================

function autoFillQuestion(){

    const text = value("bulkInput");

    function find(start,end){

        const s = text.indexOf(start);

        if(s==-1) return "";

        const from = s + start.length;

        const e = end
            ? text.indexOf(end,from)
            : -1;

        if(e==-1)
            return text.substring(from).trim();

        return text.substring(from,e).trim();

    }

    setValue(
        "questionHindi",
        find(
            "Question Hindi:",
            "Question English:"
        )
    );

    setValue(
        "questionEnglish",
        find(
            "Question English:",
            "A Hindi:"
        )
    );

    setValue(
        "a_hi",
        find(
            "A Hindi:",
            "A English:"
        )
    );

    setValue(
        "a_en",
        find(
            "A English:",
            "B Hindi:"
        )
    );

    setValue(
        "b_hi",
        find(
            "B Hindi:",
            "B English:"
        )
    );

    setValue(
        "b_en",
        find(
            "B English:",
            "C Hindi:"
        )
    );

    setValue(
        "c_hi",
        find(
            "C Hindi:",
            "C English:"
        )
    );

    setValue(
        "c_en",
        find(
            "C English:",
            "D Hindi:"
        )
    );

    setValue(
        "d_hi",
        find(
            "D Hindi:",
            "D English:"
        )
    );

    setValue(
        "d_en",
        find(
            "D English:",
            "Answer:"
        )
    );

    const ans = find(
        "Answer:",
        ""
    ).toUpperCase().trim();

    let index = 0;

    if(ans=="B") index=1;

    if(ans=="C") index=2;

    if(ans=="D") index=3;

    document
        .getElementById("answer")
        .value=index;

}



// ===========================
// PARSE QUESTION
// ===========================

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

    const ans=find(
        "Answer:",
        ""
    ).trim().toUpperCase();

    let index=0;

    if(ans=="B") index=1;

    if(ans=="C") index=2;

    if(ans=="D") index=3;

    return{

        quizTitle:value("quizTitle"),

        quizDate:getToday(),

        questionHindi:
        find(
            "Question Hindi:",
            "Question English:"
        ),

        questionEnglish:
        find(
            "Question English:",
            "A Hindi:"
        ),

        options:[

            {

                hi:find(
                    "A Hindi:",
                    "A English:"
                ),

                en:find(
                    "A English:",
                    "B Hindi:"
                )

            },

            {

                hi:find(
                    "B Hindi:",
                    "B English:"
                ),

                en:find(
                    "B English:",
                    "C Hindi:"
                )

            },

            {

                hi:find(
                    "C Hindi:",
                    "C English:"
                ),

                en:find(
                    "C English:",
                    "D Hindi:"
                )

            },

            {

                hi:find(
                    "D Hindi:",
                    "D English:"
                ),

                en:find(
                    "D English:",
                    "Answer:"
                )

            }

        ],

        answer:index,

        published:true

    };

}
import pg from "pg";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "Password1!",
    port: 5432
});

db.connect();

let totalCorrect = 0;
let currentQuestion = {};
let quiz = [
    { country: "France", capital: "Paris" },
    { country: "United Kingdom", capital: "London" },
    { country: "United States of America", capital: "New York" },
]

db.query("SELECT * FROM capitals", (err,res)=>{
    if(err){
        console.error("Error executing query", err.stack);
    } else {
        quiz = res.rows;
    }
    db.end();
});

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req,res) => {
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("capital.ejs",{question: currentQuestion});
});

app.post("/submit",(req,res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if(currentQuestion.capital.toLowerCase()===answer.toLowerCase()){
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect=true;
    }

    nextQuestion();

    res.render("capital.ejs", {
        question: currentQuestion,
        wasCorrect: isCorrect,
        totalScore: totalCorrect,
    });
});

async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

    currentQuestion = randomCountry;
}

app.listen(port,(req,res) => {
    console.log(`Server is running at https://localhost:${port}`);;
});

// const db = new Client({
//     user: "username",
//     host: "localhost",
//     database: "mydatabase",
//     port: 5432,
// });
// db.connect();

// db.query("SELECT * FROM users", (err,res)=>{
//     if(err){
//         console.error("Error executing query", err.stack);
//     } else {
//         console.log("User data:", res.rows);
//     }

//     db.end();
// });

// db.query("CREATE TABLE")
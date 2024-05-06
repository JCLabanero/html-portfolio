import bodyParser from "body-parser";
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req,res) => {
    try {
        const response = await axios.get("https://bored-api.appbrewery.com/random");
        const result = response.data;
        res.render("random.ejs",{data: result});
    } catch (error) {
        console.error("Failed to make request:",error.message);
        res.render("random.ejs", {
            error: error.message,
        });
    }
});

app.post("/",async (req,res) => {
    try {
        const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${req.body.type}&participants=${req.body.participants}`);
        // const response = await axios.get("https://bored-api.appbrewery.com/filter?type="+req.body.type+"&participants="+req.body.participants);
        const result = response.data;
        // console.log(result);
        res.render("random.ejs",{data: result[Math.round(Math.random()*result.length)]});
    } catch (error) {
        console.error("Failed to make request:",error.message);
        res.render("random.ejs", {
            error: "No such activity exists.",
        });
    }
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});
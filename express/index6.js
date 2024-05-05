import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var fullname = 0;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    if(fullname<=0)
        res.render("name.ejs",{output: "Enter your name below: "})
    else {
        res.render("name.ejs",{output: `There are ${fullname} letters in your name.`})}
});

app.post("/submit", (req, res) => {
    var fname = req.body["fName"];
    var lname = req.body["lName"];
    var mekus = fname+lname;
    fullname = mekus.split(" ").join("").length;
    res.redirect("back");
    // res.render("name.ejs",{numOfLetters: fullname});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

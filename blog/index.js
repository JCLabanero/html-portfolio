import express from "express"
import bodyParser from "body-parser"

// const __directory = bodyParser.urlencoded({extended: true})
const app = express();
const port = 3000;

var postsVar = [{
    title: "Sample blog post", 
    date: "January 1, 2021",
    name: "Mark",
    content: "This blog post shows a few different types of content that’s supported and styled with Bootstrap. Basic typography, lists, tables, images, code, and more are all supported as expected.",
}];

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("static"));

app.get("/",(req,res) => {
    // res.send("<p>Hello world!</p>");
    res.render("index.ejs",{posts: postsVar});
});

app.post("/post",(req,res) => {
    var mode = req.body["mode"];

    if(mode=="Delete"){
        var index = Number(req.body["index"]);
        postsVar.splice(index,1);
        res.redirect("back");
    }
    res.render("crud.ejs",{ mode: req.body["mode"], index: req.body["index"] });
});

app.post("/create",(req,res) => {
    const today = new Date();
    const month = today.toLocaleString('default',{month:"long"});
    const date = month + " " + today.getDay() +", "+ today.getFullYear();
    var title = req.body["title"], content = req.body["content"], name=req.body["name"];
    postsVar.push(postBlog(title,content,date,name));
    res.redirect("/");
});

app.post("/update",(req,res) => {
    const index=Number(req.body["index"]);
    const today = new Date();
    const orig = postsVar[index];
    const title=req.body.title || orig.name;
    const content = req.body.content || orig.content;
    const date = today.toLocaleString('default',{month:"long"}) + " " + today.getDay() +", "+ today.getFullYear() || orig.date;
    const name = req.body.name || orig.name;
    postsVar[index] = postBlogUpdate(title,content,date,name);
    res.redirect("/");
});

app.delete("/delete",(req,res) => {
    console.log("deleteing");
});

app.listen(port,() => {
    console.log(`Listening from port ${port}`);
});

function postBlog(title,content,date,name){
    return { title: title, content: content, date: date, name: name };
}
function postBlogUpdate(title,content,date,name){
    return { title: title, content: content, date: date, name: name };
}
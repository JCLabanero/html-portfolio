import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res)=>{
    res.send("<h1>Home Page</h1>");
});

app.get("/about", (req, res)=>{
    res.send("<h1>About</h1>");
});

app.get("/contact", (req, res)=>{

});

app.post("/register", (req, res) => {
    //Do something with the data
    res.sendStatus(201);
});

app.put("/user/johncarlo", (req, res) => {
    res.sendStatus(200);
});

app.patch("/user/johncarlo", (req, res) => {
    res.sendStatus(200);
});

app.delete("/user/johncarlo", (req, res) => {
    res.sendStatus(200);
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`); // only works with backtics
});


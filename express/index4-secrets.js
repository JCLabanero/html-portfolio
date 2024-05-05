import bodyParser from "body-parser";
import express from "express"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var isAuth = false;

app.use(bodyParser.urlencoded({ extended: true }));
function authPassword(req,res,next) {
    const password = req.body.password;
    if(password == "ILoveProgramming")
        isAuth = true;
    next();
}
app.use(authPassword);

app.get("/",(req,res)=> {
    res.sendFile(__dirname+"/homepage.html");
});
app.post("/check",(req,res)=> {
    if(req.body["password"]=="ILoveProgramming")
        res.sendFile(__dirname+"/secret.html");
    else
        res.sendFile(__dirname+"/homepage.html");
});
app.listen(port,()=> {
    console.log(`Listening to port ${port}`);
});
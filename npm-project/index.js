// var generateName = require('sillyname');
// var qr = require('qr-image');
import generateName from "sillyname"
import superheroes, { randomSuperhero } from "superheroes"
import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

var sillyname = generateName();
var name = randomSuperhero();

console.log("My name is "+sillyname+".\nMy Hero name is "+superheroes[Math.round(Math.random()*superheroes.length)]);
console.log("ANother hero name is "+name);

inquirer.prompt([
    {
        message: "Type in your URL: ",
        name: "URL",
    },
]).then((answer)=>{
    const url = answer.URL;
    var qr_svg = qr.image(url);
    qr_svg.pipe(fs.createWriteStream("qr_img.png"));
    fs.writeFile("url.txt",url+"\n",(err)=>{
        if(err) throw err;
        console.log("URL file have been created");
    })
}).catch((error)=>{
    if(error.isTtyError){

    } else {

    }
})


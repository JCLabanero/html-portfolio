const fs = require("fs");

fs.writeFile("message.txt","Hello from JC using NodeJS", (err)=>{
    if(err) throw err;
    console.log("The file has been saved");
});
fs.appendFile("message.txt","\nHello from another JC", (err)=>{
    if(err) throw err;
    console.log("Another message have been appended");
});
fs.readFile("./message.txt","utf-8",(err, data)=>{
    if(err) throw err;
    console.log(data);
});
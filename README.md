# html-portfolio

## Hey

### Notes

1. Terminal Commands  [More Commands]("https://gist.github.com/bradtraversy/cc180de0edee05075a6139e42d5f28ce")
    - list the file ```ls```
    - make directory ```mkdir```
    - change directory ```cd```
    - create ```touch file.extension```
    - open file ```open file.extension```
    - ```open ~a /Applications/Visual\Studio\Code```
    - remove file ```rm file.extension```
    - remove everything ```rm *```
    - remove a directory ```rm -r directoryName```
    - -f force a tag
    - print working directory ```pwd```

2. Node JS
    - Writing file with node native modules [Node.js](https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs)
    - Node Package Managers [npm](https://www.npmjs.com/)
    - V12 node enable Ecma Script M (ESM)
        - in package json "type": "module"
    - Using ExpressJS to make server [ExpressJS](https://expressjs.com/)

    ```cmd
    npm init -y
    ```

    - In JS, string interpolation only works with backtics `${variableName}`

    - to see which ports are open

    ```cmd
    netstat -ano | findstr "LISTENING"
    ```

    - How to properly close a port [Blog Post](https://dev.to/sylwiavargas/how-to-properly-close-a-port-2p36)

    - Using nodemon from npm to run updating port (-g for global)

    ```cmd
    npm i -g nodemon
    ```

    ```cmd
    nodemon file.extension
    ```

    ```cmd
    Set-ExecutionPolicy remotesigned -scope process
    ```

    - [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

    - A tool for testing or debugging server [Postman](https://www.postman.com/downloads/)

    - Using npm install to install all dependencies that are in package.json

    ```cmd
    npm install
    ```

    - body-parser morgan (middlewares) (logging, error, pre-processing, auth)

3. EJS
    - EJS is a view
    - Install EJS from extensions

    ![EJS](images/ssejs.png)

    ```ejs
    <%- include("footer.ejs")%>
    ```

    ```ejs
    res.render("name.ejs",{name:"JC"})
    ```

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Password1!",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted(user_id) {
  let countries = [];
  try {
    const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id=$1",[user_id]);
    if(!result.rowCount)
      return countries;
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });
    
  } catch (error) {
    return countries;
  }
  return countries;
}
async function getUsers(){
  const result = await db.query("SELECT * from users")
  let allUsers = [];
  if(result.rowCount>0){
    result.rows.forEach((e)=>{
      allUsers.push(
        {
          id: e.id,
          name: e.name,
          color: e.color
        });
    });
  }
  return allUsers;
}
function createResponse(countries,total,users,color,error=null){
  const varr = {
    countries: countries,
    total: total,
    users: users,
    color: color,
    error: error
  };
  return varr;
}
app.get("/", async (req, res) => {
  users = await getUsers();
  if(users.length<1)
    return res.render("travel.ejs",createResponse([],0,users,"teal"));
  const countries = await checkVisisted(currentUserId);
  const cuurent_user = users.find(e=>e.id===currentUserId) || users[0];
  res.render("travel.ejs", createResponse(countries,countries.length,users,cuurent_user.color));
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
        [countryCode,currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    const countries = await checkVisisted(users[0].id);
    res.render("travel.ejs", createResponse(countries,countries.length,users,users[0].color));
  }
});

app.post("/user", async (req, res) => {
  const is_creating = req.body.add;
  if(is_creating)
    return res.redirect("/new");
  const user_id = parseInt(req.body.user);
  if(!user_id)
    return res.render("travel.ejs", createResponse([],0,users,"teal","Error 404: not found in db"));
  const visited_countries = await checkVisisted(user_id);
  users = await getUsers();
  const current_user = users.find(e => e.id === user_id);
  currentUserId=current_user.id;
  // console.log(`Current: ${currentUserId}`);
  res.render("travel.ejs",createResponse(visited_countries,visited_countries.length,users,current_user.color));
});

app.get("/new", async (req,res)=>{
  res.render("travel-new.ejs");
});

app.post("/new", async (req, res) => {
  const new_user = [
    req.body.name,
    req.body.color
  ]
  try {
    const response_db = await db.query("INSERT INTO users(name,color) VALUES($1,$2)",new_user);
    if(response_db.rowCount<0)
      throw new Error(`Failed to create user ${new_user[0]}`);
    const added_user = response_db.rows[0];
    const countries = await checkVisisted(added_user.id);
    users = await getUsers();
    res.render("travel.ejs",createResponse(countries,countries.length,users,added_user.color));
  } catch (error) {
    const countries = await checkVisisted(0);
    users = await getUsers();
    res.render("travel.ejs",createResponse(countries,countries.length,users,users[0].color))
  }
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Password1!",
  port: 5432
});

db.connect();

async function getCountries(){
  try {
    const request = await db.query("SELECT country_code FROM visited_countries");
    let countries = [];
    request.rows.forEach((i)=>{ countries.push(i.country_code) });
    return countries;
  } catch (error) {
    console.error("Error requesting query:",error);
  }
}

async function addCountry(country){
  await db.query("INSERT INTO visited_countries(country_code) VALUES($1)", [country.toUpperCase()]);
}

app.get("/", async (req, res) => {
  //Write your code here.
  const countries = await getCountries();
  console.log(countries);
  res.render("travel.ejs", {total:countries.length, countries:countries});
});

app.post("/add", async (req,res) => {
  const countryToAdd = req.body.country;
  const listOfCountries = await getCountries();
  const found = listOfCountries.includes(countryToAdd.toUpperCase());
  if(found==false && countryToAdd.trim()!="")
    await addCountry(countryToAdd);
  console.log(`Trying to add ${countryToAdd.toUpperCase()}, in existing countries ${found}`);
  res.redirect("back");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

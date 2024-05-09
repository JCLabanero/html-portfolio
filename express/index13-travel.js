import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import { titleCase } from "title-case";

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

// async function addCountry(country_code){
//   try {
//     await db.query("INSERT INTO visited_countries(country_code) VALUES($1)", [country_code]);
//   } catch (error) {
//     console.error("Error inserting data:",error);
//   }
// }

// async function getCodeFromName(country_name){
//   try {
//     const query = await db.query("SELECT country_code FROM countries WHERE country_name=$1",[titleCase(country_name)]);
//     if(query.rows.length == 0)
//       return null;
//     const to_return = query.rows[0].country_code.toUpperCase()
//     return to_return;
//   } catch (error) {
//     console.error("Error requesting query:",error);
//     return null;
//   }
// }

// async function getCountryThatHasAName(country_name){
//   try {
//     const query = await db.query("SELECT country_name FROM countries LIKE %$1%",[titleCase(country_name)]);
//     if(query.rows.length == 0)
//       return null;
//     return query.rows[0].country_code.toUpperCase();
//   } catch (error) {
//     console.error("Error requesting query:",error);
//     return null;
//   }
// }

app.get("/", async (req, res) => {
  const countries = await getCountries();
  console.log(countries);
  res.render("travel.ejs", {total:countries.length, countries:countries});
});

app.post("/add", async (req,res) => {
  const countryToAdd = titleCase(req.body.country).trim();
  console.log(`${countryToAdd}`);
  try { 
    // const query = await db.query("SELECT country_code FROM countries WHERE country_name=$1",
    const query = await db.query("SELECT country_code FROM countries WHERE country_name ILIKE $1",
    [`%${countryToAdd}%`]);
    if(query.rowCount == 0)
      throw new Error("No matching country found");
    const country_code = query.rows[0].country_code.toUpperCase();

    try {
      const query_find = await db.query("SELECT country_code FROM visited_countries WHERE country_code=$1",[country_code]);
      console.log(query_find.rowCount)
      if(query_find.rowCount!=0)
        throw new Error("Country have already been added");
      
      await db.query("INSERT INTO visited_countries(country_code) VALUES($1)",[country_code]);
      res.redirect("/");
    } catch (error) {
      console.log("Query breaks",error)
      const allCountries = await getCountries();
      res.render("travel.ejs", {
        total:allCountries.length, 
        countries:allCountries,
        error: "Country have already been added."
      });
    }

    console.log(`Code: ${country_code}`);
  } catch (error) {
    console.log("Query breaks",error)
    const allCountries = await getCountries();
    res.render("travel.ejs", {
      total:allCountries.length, 
      countries:allCountries,
      error: "Country code couldn't find."
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

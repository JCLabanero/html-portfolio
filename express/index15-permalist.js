import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

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

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

db.query("SELECT * FROM items",(err,res)=>{
  if(err){
    console.error(err);
  } else {
    items=res.rows;
  }
});

app.get("/", (req, res) => {
  res.render("permalist.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const command = "INSERT INTO items(title) VALUES ($1) RETURNING id";
  const result = await db.query(command,[item]);
  items.push({ id: result.rows[0].id,title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const item_id = req.body.updatedItemId;
  const item_name = req.body.updatedItemTitle;

  const command = "UPDATE items SET title=$1 WHERE id=$2";
  await db.query(command,[item_name,item_id]);
  const index = items.findIndex(element=>element.id==item_id);
  if(index>=0)
      items[index].title = item_name;
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const item_id = req.body.deleteItemId;
  const command = "DELETE FROM items WHERE id=$1";
  await db.query(command,[item_id]);
  const index = items.findIndex(element=>element.id==item_id);
  if(index>=0)
    items.splice(index,1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

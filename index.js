const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "crud.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running at localhost:3000");
    });
  } catch (error) {
    console.log(`DB Error ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//Read Api
app.get("/details/", async (request, response) => {
  const getDetailsQuery = `SELECT * FROM details`;
  const detailsArray = await db.all(getDetailsQuery);
  response.send(detailsArray);
});

//Create Api
app.post("/details/", async (request, response) => {
  const { name, img, summary } = request.body;
  const postQuery = `INSERT INTO details
  (name,img,summary)
  VALUES('${name}','${img}','${summary}')`;

  await db.run(postQuery);
  response.send("Query Posted");
});

//Update api
app.put("/detail/", async (request, response) => {
  const { name, img, summary } = request.body;
  const UpdateQuery = `UPDATE 
  details
  SET 
  name = '${name}',
  img = '${img}',
  summary = '${summary}'
  WHERE name LIKE "%God%"`;
  await db.run(UpdateQuery);
  response.send("Details Updated");
});

//Delete api

app.delete("/detail/:name", async (request, response) => {
  const { name } = request.body;
  const deleteQuery = `
    DELETE FROM 
    details
    WHERE 
    name = '${name}'`;
  await db.run(deleteQuery);
  response.send("Details Deleted");
});

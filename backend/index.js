const express = require("express");
const cors = require("cors");
const mySqlPool = require("./config/db");
const user = require("./router/userRouter");
const weather = require("./controller/weatherCtrl");
const dotenv = require("dotenv")
const app = express();
app.use(cors());

require('dotenv').config();

app.use(express.json());

const Port = process.env.PORT || 2000;

app.get("/", (req, res) => {
  res.send("Hello world");
});


app.use('/api/weather', weather)
app.use('/api/user', user)


mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("Database Connected Successfully");

    app.listen(Port, () => {
      console.log(`server is running at ${Port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

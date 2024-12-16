const express = require("express");
const cors = require("cors");
const { createDatabase, checkConnection } = require('./config/db');
const  createTable  = require("./utils/dbUtils");
const user = require("./routes/userRoutes");
const weather = require("./routes/weatherRoutes");
const app = express();
require('dotenv').config();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use('/api/user', user)
app.use('/api/weather', weather)


const PORT = process.env.PORT || 2000;
app.listen(PORT, async() =>{
    console.log(`Server is runnin on Port ${PORT}`);
    try {
        await createDatabase()
        await checkConnection();
        await createTable()
    } catch (error) {
        console.log("Failed to initialize the databse", error);
    }
})
const mysql2 = require("mysql2/promise")
const dotenv = require("dotenv")
dotenv.config()

const {
    DB_HOST: host,
    DB_USER: user,
    DB_PASSWORD: password,
    DB_NAME: database,
    DB_PORT: port
} = process.env;

  const pool = mysql2.createPool({
    host,
    user,
    password,
    database,
    port,
    connectionLimit: 10,
    waitForConnections:true
})

  const createDatabase = async() =>{
    try {
        const tempConnection = await mysql2.createConnection({host, user, password, port})
        const dbQuery = `CREATE DATABASE IF NOT EXISTS \`${database}\`;`;
        await tempConnection.query(dbQuery)
        console.log(`Database ${database} created or already exists.`);
    } catch (error) {
        console.log("Error create to database!");
        throw error;
    }
  }

  const checkConnection = async() => {
    try {
        const connection = await pool.getConnection();
        console.log("Database Connected successfully!");
        connection.release()
    } catch (error) {
        console.log("Error connection to database!");
        throw error;
    }
  }

  module.exports = {
    pool,
    createDatabase,
    checkConnection,
  };
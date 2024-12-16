const { pool } = require('../config/db')

const usersTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_no VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const weatherTableQuery = `CREATE TABLE IF NOT EXISTS weatherReports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    timezone VARCHAR(255) NOT NULL,
    temperature FLOAT NOT NULL,
    weather_descriptions TEXT NOT NULL,
    observation_time VARCHAR(5) NOT NULL, -- 'HH:mm' format
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`

const createAndMsg = async (tableName, query) => {
    try {
      await pool.query(query);
      console.log(`${tableName} table created or already exists.`);
    } catch (error) {
      console.error(`Error creating ${tableName} table!`, error.message);
      throw error;
    }
  };

const createTable = async () => {
    try {
      await createAndMsg("users", usersTableQuery);
      await createAndMsg("weatherReports", weatherTableQuery);

      console.log("All tables created successfully!");
    } catch (error) {
      console.error("Error creating tables!", error.message);
      throw error;
    }
};

module.exports = createTable
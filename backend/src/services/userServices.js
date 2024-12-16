const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const UserModel = require("../models/userModel"); // Assuming UserModel is imported here
const JWT_SECRET = process.env.JWT_SECRET || "mynameiskhan";

// Service: Register User
const registerUserService = async ({ name, phone_no, email, password }) => {
  try {
    const phoneRegex = /^[0-9]{10}$/; 
    if (!phoneRegex.test(phone_no)) {
      throw new Error("Invalid phone number. Please enter a valid 10-digit phone number.");
    }
    const checkQuery = `SELECT * FROM users WHERE email = ?`;
    const [existingUser] = await pool.query(checkQuery, [email]);
    if (existingUser.length) {
      throw new Error("Email already exists.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = `INSERT INTO users (name, phone_no, email, password) VALUES (?, ?, ?, ?)`;
    const insertValues = [name, phone_no, email, hashedPassword]
    const [result] = await pool.query(insertQuery, insertValues);

    return { userId: result.insertId }; 
  } catch (error) {
    console.error("Error in registerUserService:", error.message);
    throw error;
  }
};

// Service: Login User
const loginUserService = async ({ email, phone_no, password }) => {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM users WHERE email = ? OR phone_no = ?`;
    const [users] = await connection.query(query, [email, phone_no]);
    if (!users.length) {
      throw new Error("User not found.");
    }
    const user = new UserModel(users[0]);
    const inputPassword = String(password);
    const storedPassword = String(user.password);
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    if (!isMatch) {
      throw new Error("Invalid credentials.");
    }
    const token = jwt.sign({ id: user.id, email: user.email, phone_no: user.phone_no, name: user.name }, JWT_SECRET, { expiresIn: "1h" });
    return { token };
  } finally {
    connection.release();
  }
};

// Service: Reset Database
const resetDatabaseService = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query("TRUNCATE TABLE users");
    await connection.query("ALTER TABLE users AUTO_INCREMENT = 1");
    return { message: "Database reset successfully, auto-increment set to 1." };
  } finally {
    connection.release();
  }
};

module.exports = {
  registerUserService,
  loginUserService,
  resetDatabaseService,
};

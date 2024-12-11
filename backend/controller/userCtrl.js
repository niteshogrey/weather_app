const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "mynameiskhan"

const getResponse = (req, res) => {
  res.send("This is user router");
};



const registerUser = async (req, res) => {
  const { name, phone_no, email, password } = req.body;

  if (!name || !phone_no || !email || !password) {
    return res.status(400).send({
      success: false,
      message:
        "Please provide all required fields (name, phone_no, email, password)",
    });
  }
  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists." });
    }
     // Ensure password is a string
     const passwordStr = String(password);  // Explicitly convert to string

     // Generate salt
     const salt = await bcrypt.genSalt(10);  // 10 rounds for salt
     console.log('Generated salt:', salt);  // Debug the salt value
 
     // Verify the argument types
     console.log('Password type:', typeof passwordStr);  // Should be 'string'
     console.log('Salt type:', typeof salt);  // Should be 'string'
    const hashedPassword = await bcrypt.hash(passwordStr, salt);
    console.log('hashed:', hashedPassword);
    

    const [result] = await db.query(
      `INSERT INTO users (name, phone_no, email, password) VALUES (?, ?, ?, ?)`,
      [name, phone_no, email, hashedPassword]
    );
    if (result.affectedRows === 0) {
      return res.status(500).send({
        success: false,
        message: "Failed to insert the user record",
      });
    }
    console.log(result.insertId);
    res.status(201).send({
      success: true,
      message: "user registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send({
      success: false,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  
  try {
    // Fetch user from the database
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Ensure both the password and stored password are strings
    const passwordStr = String(password);  // Ensure password is a string
    const storedPassword = String(user.password);  // Ensure stored password is a string

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(passwordStr, storedPassword);
    
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      
      // Generate a token if passwords match
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: "Login successful.", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  };
  
  const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (!userId) {
        return res.status(400).send({
          success: false,
          message:
            "Please provide all required fields (name, phone_no, email, password)",
        });
      }
      const { name, phone_no, email, password } = req.body;
      if (!name || !phone_no || !email || !password) {
        return res.status(400).send({
          success: false,
          message:
            "Please provide all required fields (name, phone_no, email, password)",
        });
      }
      const [data] = await db.query(
        `UPDATE users SET name = ?, phone_no = ?, email = ?, password = ? WHERE id = ? `,
        [name, phone_no, email, password, userId]
      );
      if (!data) {
        return res.status(500).send({
          success: false,
          message: "Failed to insert the user record",
        });
      }
      console.log(data);
      res.status(201).send({
        success: true,
        message: "user detail updated",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).send({
        success: false,
        message: "An internal server error occurred",
        error: error.message,
      });
    }
  };




module.exports = { getResponse, registerUser, login, updateUser };

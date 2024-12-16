const { registerUserService, loginUserService, resetDatabaseService } = require("../services/userServices");
  
  // Controller: Get Response
  const getResponse = (req, res) => {
    res.send("This is the user router.");
  };
  
  // Controller: Register User
  const register = async (req, res) => {
    const { name, phone_no, email, password } = req.body;
    if (!name || !phone_no || !email || !password) {
      return res.status(400).json({
             success: false,
             message: "Please provide all required fields (name, phone_no, email, password).",
      });
    }
    try {
      const result = await registerUserService({ name, phone_no, email, password });
      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        userId: result.userId,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  // Controller: Login User
  const login = async (req, res) => {
    const { email, password, phone_no} = req.body;
    if (!email && !phone_no) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required.",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Passward is required"
      })
      
    }
    try {
      const emailOrPhone = email || phone_no;
      const result = await loginUserService({ email, phone_no, password });
      res.status(200).json({
        success: true,
        message: "Login successful.",
        token: result.token,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "wrong email/phone or password",
      });
    }
  };
  
  // Controller: Reset Database
  const resetDatabase = async (req, res) => {
    try {
      const result = await resetDatabaseService();
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error resetting database.",
        error: error.message,
      });
    }
  };
  
  module.exports = {
    getResponse,
    register,
    login,
    resetDatabase,
  };
  
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

const Login = () => {
  const [value, setValue] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate()
  
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async () => {
    const { email, password } = value;
  
    // Validation check (optional)
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:1000/api/user/login", {
        email,
        password,
      });
  
      if (response.status === 200) {
        // Save the token to localStorage or state
        localStorage.setItem("Token", response.data.token);
        
        alert("login Successfull")
        navigate('/')
       
      } else {
        setErrorMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };
  

  return (
    <div className="flex flex-col m-24">
      <div className="flex flex-col justify-center m-auto border border-black rounded-lg p-14">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold underline mb-5 text-blue-500">Log In</h1>
        </div>
        <div className="flex flex-col justify-center">
          <input
            className="h-10 w-60 border border-black rounded-full px-3 my-3 font-medium"
            type="text"
            name="email"
            onChange={handleChange}
            value={value.email}
            placeholder="Enter your email"
          />
        </div>

        <div className="flex flex-col justify-center">
          <input
            className="h-10 w-60 border border-black rounded-full px-3 my-3 font-medium"
            type="password"
            name="password"
            onChange={handleChange}
            value={value.password}
            placeholder="Enter password"
          />
        </div>
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        <div className="flex mt-2 gap-1">
          <p>Don't have an account? </p>
          <a href="/register" className="underline text-violet-800">Register</a>
        </div>
        <div className="flex justify-center mt-3">
          <button
            className="bg-blue-400 p-3 rounded-full font-semibold"
            type="button"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

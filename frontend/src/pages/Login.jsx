import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { loginUser } from '../redux/features/authSlice'; // Assuming the loginUser action is defined in your Redux slice.

const Login = () => {
  const [value, setValue] = useState({
    emailOrPhone: "",  // Single input field for both email and phone number
    password: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailOrPhone, password } = value; 
    if (!emailOrPhone || !password) {
      setErrorMsg("Email/Phone and Password are required.");
      return;
    }

    try {
      const useCredential = { email: emailOrPhone, phone_no: emailOrPhone, password };
      const response = await dispatch(loginUser(useCredential)).unwrap(); 
      if (response.token) {
        localStorage.setItem("Token", response.token); // 
        alert("Login Successfully!");
        navigate("/"); 
      }
    } catch (error) {
      setErrorMsg(error.message || "Invalid email/phone or password.");
    }
  };

  return (
    <div className="flex flex-col m-24">
      <div className="flex flex-col justify-center m-auto border border-black rounded-lg p-20">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold underline mb-5 text-blue-500">Log In</h1>
        </div>
        <div className="flex flex-col justify-center">
          <input
            className="h-10 w-80 border border-black rounded-full px-3 my-3 font-medium"
            type="text"
            name="emailOrPhone" 
            onChange={handleChange}
            value={value.emailOrPhone}
            placeholder="Enter your email or phone number"
          />
        </div>

        <div className="flex flex-col justify-center">
          <input
            className="h-10 w-80 border border-black rounded-full px-3 my-3 font-medium"
            type="password"
            name="password"
            onChange={handleChange}
            value={value.password}
            placeholder="Enter password"
          />
        </div>
        {errorMsg && (
          <div className="text-red-500 mt-2">{errorMsg}</div>
        )}
        <div className="flex mt-2 gap-1">
          <p>Don't have an account? </p>
          <a href="/register" className="underline text-violet-800">Register</a>
        </div>
        <div className="flex justify-center mt-3">
          <button
            className="bg-blue-400 p-3 w-80 rounded-full font-semibold"
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

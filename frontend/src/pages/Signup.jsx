import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate()
    const [value, setValue] = useState({
        name: "",
        email: "",
        phone_no: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:1000/api/user/register", value,
                {
                headers: {
                    "Content-Type": "application/json", // Explicitly set JSON header
                },})
            
            console.log("Response:", response);

            if (response.data.success) {

                alert("User registered successfully!");
                navigate('/login')
            } else {
                setMessage(response.data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="flex flex-col m-11">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center m-auto border border-black rounded-lg p-20"
            >
                <div className="flex justify-center">
                    <h1 className="text-3xl font-bold underline mb-5 text-blue-500">Sign Up</h1>
                </div>

                <div className="flex flex-col justify-center">
                    <input
                        className="h-10 w-60 border border-black rounded-full px-3 my-3 font-medium"
                        type="text"
                        name="name"
                        value={value.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <input
                        className="h-10 w-60 border border-black rounded-full px-3 my-3 font-medium"
                        type="email"
                        name="email"
                        value={value.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <input
                        className="h-10 w-60 border border-black rounded-full px-3 my-3 font-medium"
                        type="text"
                        name="phone_no"
                        value={value.phone_no}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <input
                        className="h-10 w-60 border border-black rounded-full px-3 my-3 font-medium"
                        type="password"
                        name="password"
                        value={value.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter password"
                    />
                </div>

                <div className="flex mt-2">
                    <p>Already have an account?</p>
                    <a href="/login" className="underline text-blue-500 ml-1">
                        Login
                    </a>
                </div>

                <div className="flex justify-center mt-3">
                    <button className="bg-blue-400 p-3 rounded-full font-semibold" type="submit">
                        Register
                    </button>
                </div>
            </form>

            {message && (
                <div className="mt-4 text-center">
                    <p
                        className={`p-2 rounded-lg ${
                            message === "User registered successfully!"
                                ? "bg-green-200 text-green-700"
                                : "bg-red-200 text-red-700"
                        }`}
                    >
                        {message}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Signup;

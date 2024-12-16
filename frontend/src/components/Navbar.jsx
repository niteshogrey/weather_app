import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";



const useAuth = () =>{
  return !!localStorage.getItem("Token")
}

const Navbar = () => {
    const navigate = useNavigate()
    const isAuthanticated = useAuth()

    const handlesignup = () =>{
        navigate("/register")
    }

    const handleLogOut = () =>{
        localStorage.removeItem("Token")
        navigate("/login")
    }

  return (
    <div className="flex flex-row justify-between h-14 top-5 bg-blue-400 items-center">
      <div className="pl-5">
        <Link to="/" className="text-xl font-bold mr-5 no-underline">
          WeatherApp
        </Link>
      </div>
      <div className="flex flex-row gap-10 pr-5">
        {
          (isAuthanticated) ? 
          (<button className="bg-green-600 p-2 rounded-full text- " type="button" onClick={handleLogOut} >Log out</button>) :

        (<button className="bg-red-600 p-2 rounded-full font-semibold" type="button" onClick={handlesignup} >SignUp</button>)
        }
      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-5xl">
        <a href="/"> <CgProfile/></a>
       
      </div>
      </div>
    </div>
  );
};

export default Navbar;

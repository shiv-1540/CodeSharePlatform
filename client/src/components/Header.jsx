import React from "react";
import logo from "../assets/logo-white.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-gray-900 text-white py-4 px-8 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10" />
        <span className="text-xl font-semibold">CodeShare</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</Link>
        <Link to="/registration" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</Link>
      </div>
    </div>
  );
};

export default Header;
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 🔰 Logo + App Name */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHeos4HFUz6T8LCNOpdcFH6mCA63Drw8qJn-E9dsNQ7VbYiW5fYM4UZb9VOu7VS5aAN9k&usqp=CAU"
            alt="Logo"
            className="h-8 w-8 object-cover"
          />
          <h1 className="text-2xl font-bold text-blue-600 font-poppins">
            Receipe Manager
          </h1>
        </Link>

        {/* 👤 Auth Buttons */}
        {user && (
          <div className="flex gap-4 items-center">
            <Link to="/add-recipe">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                Add Recipe
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

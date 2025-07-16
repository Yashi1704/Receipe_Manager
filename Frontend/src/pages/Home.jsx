import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
  ];

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(
        `/api/recipes/${
          category && category !== "All" ? `?category=${category}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      fetchRecipes();
      return;
    }

    try {
      setIsSearching(true);
      const res = await axios.get(`/api/recipes/search?query=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setRecipes(res.data);
    } catch (err) {
      console.error("Error searching recipes:", err);
    }
  };

  useEffect(() => {
    if (user && !isSearching) {
      fetchRecipes();
    }
  }, [category, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-xl font-semibold text-red-600 bg-white px-6 py-4 rounded shadow">
          Please log in to view recipes.
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed p-4"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/01/79/59/92/360_F_179599293_7mePKnajSM4bggDa8NkKpcAHKl3pow2l.jpg')",
      }}
    >
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-l-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* 🧭 Category Buttons */}
        <div className="flex flex-wrap gap-2 mt-2 mb-4 justify-center">
          {categories.map((cat) => (
            <button
              onClick={() => {
                setCategory(cat);
                setIsSearching(false);
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              key={cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📝 Recipe Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe._id}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              key={recipe._id}
            >
              {recipe.photoUrl && (
                <img
                  src={recipe.photoUrl}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold capitalize">
                  {recipe.title}
                </h2>
                <p className="text-gray-600">{recipe.category}</p>
                <p className="text-gray-600">{recipe.cookingTime} minutes</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

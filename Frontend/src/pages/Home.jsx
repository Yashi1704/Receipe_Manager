import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];

  // ✅ Axios instance with token
  const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  // 🔄 Fetch recipes
  const fetchRecipes = async () => {
    try {
      const url = category !== "All" ? `/recipes?category=${category}` : `/recipes`;
      const res = await axiosInstance.get(url);
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  // 🔍 Search
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      fetchRecipes();
      return;
    }

    try {
      setIsSearching(true);
      const res = await axiosInstance.get(`/recipes/search?query=${searchTerm}`);
      setRecipes(res.data);
    } catch (err) {
      console.error("Error searching receipes:", err);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user && !isSearching) fetchRecipes();
  }, [category, user]);

  if (!user) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed p-4"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/01/79/59/92/360_F_179599293_7mePKnajSM4bggDa8NkKpcAHKl3pow2l.jpg')",
      }}
    >
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
        {/* 🔍 Search */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search receipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-l-md w-64 focus:outline-none focus:ring-2 focus:ring-black-400"
          />
          <button
            onClick={handleSearch}
            className="bg-purple-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* 🧭 Category Filters */}
        <div className="flex flex-wrap gap-2 mt-2 mb-4 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
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
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📝 Recipes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.length === 0 ? (
            <div className="col-span-full text-center text-red-500 font-semibold text-lg mt-4">
              😓 No receipe found.
            </div>
          ) : (
            recipes.map((recipe) => (
              <Link
                key={recipe._id}
                to={`/recipe/${recipe._id}`}
                className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02] duration-300 cursor-pointer"
              >
                {recipe.photoUrl && (
                  <div className="overflow-hidden">
                    <img
                      src={recipe.photoUrl}
                      alt={recipe.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold capitalize text-gray-800 group-hover:text-blue-600 transition duration-200">
                    {recipe.title}
                  </h2>
                  <p className="text-gray-600">{recipe.category}</p>
                  <p className="text-gray-600">{recipe.cookingTime} minutes</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-90 transition duration-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold tracking-wide">
                    View Recipe →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

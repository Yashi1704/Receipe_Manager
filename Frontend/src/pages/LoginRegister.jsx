import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginRegister = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const res = await axios.post("/api/auth/register", {
          username,
          email,
          password,
        });
        await login(res.data.email, password); // auto-login after register
      }
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-blue-600 text-white p-10 hidden md:flex flex-col justify-center items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6799/6799093.png"
            alt="Logo"
            className="w-16 h-16 mb-4"
          />
          <h2 className="text-3xl font-bold">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          <p className="text-sm mt-2 text-center px-4">
            {isLogin
              ? "Login to manage your recipes easily!"
              : "Register and start sharing your favorite dishes!"}
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
            {isLogin ? "Login to Receipe Manager" : "Register for Receipe Manager"}
          </h2>

          <p className="text-sm text-center text-gray-500 mb-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

          {errorMsg && (
            <p className="text-red-600 text-sm mb-4 text-center">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;

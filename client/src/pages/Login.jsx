import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { BASE_URL } from "../helper/PortUrl";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, { email, password });
      if (response.data.success) {
        toast.success(response.data.message);
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  from-indigo-100 to-blue-50 animate-gradient">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg transform transition-all hover:scale-105 duration-300 p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="flex items-center mt-1">
              <span className="absolute pl-3 text-gray-500">
                <FaEnvelope />
              </span>
              <input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-10 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition-transform duration-300"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center mt-1">
              <span className="absolute pl-3 text-gray-500">
                <FaLock />
              </span>
              <input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-10 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition-transform duration-300"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 hover:scale-105 transition-transform duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

"use client";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    no: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData,"formData");
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful!");
        
        // Save the `no` (user identifier) to localStorage
        localStorage.setItem("no", formData.no);

        // Redirect or handle login success (example redirection)
        setTimeout(() => {
          window.location.href = "/dashboard"; // Replace with your actual route
        }, 1000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-pink-700">
  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold text-center text-gray-700">
      Login to Your Account
    </h2>
    {message && (
      <p
        className={`text-center text-sm ${
          message === "Login successful!" ? "text-green-600" : "text-pink-600"
        }`}
      >
        {message}
      </p>
    )}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="no" className="block text-sm font-medium text-gray-600">
          Mobile No
        </label>
        <input
          type="text"
          id="no"
          name="no"
          value={formData.no}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
      >
        Login
      </button>
    </form>
  </div>
</div>

  
  );
}

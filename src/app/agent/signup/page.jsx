'use client'
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    no: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/agent-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setFormData({ name: "", no: "", password: "" });
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
    <span className="text-pink-600">Agent</span> Create an Agent Account
    </h2>
    {message && (
      <p
        className={`text-center text-sm ${
          message.includes("successfully") ? "text-green-600" : "text-red-600"
        }`}
      >
        {message}
      </p>
    )}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
          required
        />
      </div>
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
          className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
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
          className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none"
      >
        Sign Up
      </button>
    </form>
    <div className="text-center">
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/" // Replace with the correct path to your sign-in page
          className="font-semibold text-pink-600 hover:text-pink-700"
        >
          Sign In
        </Link>
      </p>
    </div>
  </div>
</div>


  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch("http://localhost:5000/api/organizationlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful!");
        
        // Save the `no` (user identifier) to sessionStorage
        sessionStorage.setItem("companyId", formData.no);

        // Redirect or handle login success (example redirection)
        setTimeout(() => {
          router.push("/company/dashboard"); // Replace with your actual route
        }, 1000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };
  const router = useRouter();
  const navigateTo = (path, item) => {
    router.push(path); // Navigate to the specified path
  };
  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-8 text-4xl font-bold text-pink-600">
        Welcome to the Dashboard
      </h1>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {/* User Card */}
        <div
          // onClick={handaleUser} // Show the modal on click
          // onClick={() => setShowModal(true)} // Show the modal on click
          className="p-6 text-gray-700 transition-all transform bg-white border border-pink-500 shadow-lg cursor-pointer rounded-xl hover:shadow-xl hover:scale-105 hover:bg-pink-500"
        >
          <h2 className="text-2xl font-bold text-center">User</h2>
          <p className="mt-2 text-center">
            View and manage user accounts and their activities.
          </p>
        </div>

        {/* Agent Card */}
        <div
          // onClick={() => navigateTo("/agent", "Agent")}
          className="p-6 text-gray-700 transition-all transform bg-white border border-pink-500 shadow-lg cursor-pointer rounded-xl hover:shadow-xl hover:scale-105 hover:bg-pink-500"
        >
          <h2 className="text-2xl font-bold text-center">Agent</h2>
          <p className="mt-2 text-center">
            Monitor agent transactions and performance insights.
          </p>
        </div>

        {/* Organization Card */}
        <div
          // onClick={() => navigateTo("/organization", "Organization")}
          className="p-6 text-gray-700 transition-all transform bg-white border border-pink-500 shadow-lg cursor-pointer hover:bg-pink-500 rounded-xl hover:shadow-xl hover:scale-105"
        >
          <h2 className="text-2xl font-bold text-center">Organization</h2>
          <p className="mt-2 text-center">
            Manage and monitor organization-level transactions and details.
          </p>
        </div>
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-700">
      <span className="text-pink-600">Organization</span> Login
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
            ID
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
        <button
              onClick={() => navigateTo("/")} // Close the modal
              className="w-full px-4 py-2 mt-4 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              Close
        </button>

       
        </div>

      </div>

    </div>




  
  );
}

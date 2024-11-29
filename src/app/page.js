'use client'

import React from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  // Card navigation handler
  const navigateTo = (path, item) => {
    sessionStorage.setItem("tablename", item); // Save selected item to session storage
    router.push(path); // Navigate to the specified path
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">
        Welcome to the Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        

        {/* User Card */}
        <div
          onClick={() => navigateTo("/user/signin", "users")}
          className="bg-white text-gray-700 border border-pink-500 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all hover:bg-pink-500"
        >
          <h2 className="text-2xl font-bold text-center">User</h2>
          <p className="mt-2 text-center">
            View and manage user accounts and their activities.
          </p>
        </div>

        {/* Agent Card */}
        <div
          onClick={() => navigateTo("/agent/signin", "agent_users")}
          className="bg-white text-gray-700 border border-pink-500 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all hover:bg-pink-500"
        >
          <h2 className="text-2xl font-bold text-center">Agent</h2>
          <p className="mt-2 text-center">
            Monitor agent transactions and performance insights.
          </p>
        </div>
        {/* Organization Card */}
        <div
          onClick={() => navigateTo("/company/signin", "company_balance")}
          className="hover:bg-pink-500 bg-white text-gray-700 border border-pink-500 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <h2 className="text-2xl font-bold text-center">Organization</h2>
          <p className="mt-2 text-center">
            Manage and monitor organization-level transactions and details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;


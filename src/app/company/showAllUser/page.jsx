"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getAllUsers"); // Update this URL with your actual backend API endpoint
        const data = await response.json();

        if (response.ok) {
          setUsers(data.data); // Assuming the API returns `data` field
        } else {
          throw new Error(data.message || "Failed to fetch users");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userNo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete_user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ no: userNo }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove the deleted user from the state
        setUsers((prevUsers) => prevUsers.filter((user) => user.no !== userNo));
      } else {
        throw new Error(result.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="mb-5 text-4xl font-bold text-pink-600">Users List</h1>
      <Link href="dashboard" className="mx-10 ms-auto">
        <button className="mb-8 text-4xl font-bold text-black">Back</button>
      </Link>

      <table className="w-3/4 border border-collapse border-gray-300 table-auto">
        <thead>
          <tr className="text-white bg-pink-500">
            <th className="px-4 py-2 border border-gray-300">No</th>
            <th className="px-4 py-2 border border-gray-300">Name</th>
            <th className="px-4 py-2 border border-gray-300">Balance</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.no} className="font-bold text-center text-black">
                <td className="px-4 py-2 border border-gray-300">{user.no}</td>
                <td className="px-4 py-2 border border-gray-300">{user.name}</td>
                <td className="px-4 py-2 border border-gray-300">{user.balance}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.no)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-4 py-2 text-gray-500 border border-gray-300"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ no: "", amount: "" });
  const [balance, setBalance] = useState(null);
  const [profit, setProfit] = useState(null);
  const [message, setMessage] = useState("");
  const [senderNo, setSenderNo] = useState(""); // For storing sender's number from sessionStorage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState("All Transactions");

  useEffect(() => {
    update();
  }, []);

  const update = () => {
    const storedNo = sessionStorage.getItem("companyId");
    if (storedNo) {
      setSenderNo(storedNo);
      fetchBalance(storedNo);
      fetchAllTransactions();
      fetchProfit();
    }
  }


  const fetchBalance = async (no) => {
    try {
      const res = await fetch("http://localhost:5000/api/show-companyShowBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no }), // Send the mobile number
      });

      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };


  const fetchProfit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/org_profit", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      });

      const data = await res.json();
      if (res.ok) {
        setProfit(data.org_profit);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };




  const handleAgentCashIn = () => {
      setShowPopup(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/companySendmoney", {
        receiverNo: formData.no,
        amount: formData.amount,
        transactionType: "Agent CashIn",
      });
      if (res.status === 200) {
        setMessage(res.data.message);
        setShowPopup(false);
        setFormData({ no: "", amount: "" });
        update();
        fetchBalance(senderNo);
        // fetchTransactions();
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Transaction failed. Try again.");
    }
  };





  const fetchAllTransactions = async () => {
    try {
      setError('')
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/organazationtransection");
      setFilteredTransactions(res.data);
      setSelectedTransactionType("All Transactions");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactionsByType = async (endpoint, type) => {
    try {
      setError("")
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/${endpoint}`);
      setFilteredTransactions(res.data);
      setSelectedTransactionType(type);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };
  const handleApiError = (err, defaultMsg = "Data Not Found") => {
    setError(err.response?.data?.error || defaultMsg);
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-r from-pink-500 to-pink-700">
      <header className="py-6 text-center bg-pink-700">
        <h1 className="text-4xl font-bold">Bkash Organization</h1>
      </header>

      <main className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-100">Balance:</h2>
          <p className="text-xl font-bold text-green-300">{balance !== null ? `${balance} Taka` : "Loading..."}</p>
        </div>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-100">Profit:</h2>
          <p className="text-xl font-bold text-green-300">{profit !== null ? `${profit.toFixed(2)} Taka` : "Loading..."}</p>
        </div>

        <div
          // key={index}
          onClick={handleAgentCashIn}
          className="flex justify-center px-6 py-2 mb-2 text-center transition duration-200 transform bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:scale-101"
        >
          <h2 className="text-xl font-semibold text-gray-800 " >Agent CashIn</h2>
        </div>
        
        <div
          className="flex justify-center px-6 py-2 mb-2 text-center transition duration-200 transform bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:scale-101"
        >
          <Link href="showAllAgent"><h2 className="text-xl font-semibold text-gray-800 " >Show All Agent</h2></Link>
        </div>
        <div
          className="flex justify-center px-6 py-2 mb-2 text-center transition duration-200 transform bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:scale-101"
        >
          <Link href="showAllUser"><h2 className="text-xl font-semibold text-gray-800 " >Show All User</h2></Link>
        </div>



        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Agent CashIn</h3>
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
                    className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-600">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    required
                  />
                  <p className="text-red-600">{message}</p>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6 text-black">
          <button onClick={() => fetchAllTransactions(senderNo)} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
            All Transactions
          </button>
          <button onClick={() => fetchTransactionsByType("withdraw_organazation_transection", "Agent Withdraw")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          Agent Withdraw
          </button>
          <button onClick={() => fetchTransactionsByType("sendmoney_organazation_transection", "Agent CashIn")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          Agent CashIn
          </button>
          <button onClick={() => fetchTransactionsByType("CashOut_organazation_transection", "User CashOut")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          User CashOut
          </button>
          <button onClick={() => fetchTransactionsByType("user_CashIn_organazation_transection", "User CashIn")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          User CashIn
          </button>
          <button onClick={() => fetchTransactionsByType("p2psendMoney_organazation_transection", "P2P")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          P2P
          </button>
        </div>

        <div className="px-6">
          <h1 className="mb-4 text-xl font-bold text-center">{selectedTransactionType}</h1>
          {loading ? (
            <p className="text-center text-white">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <table className="min-w-full border border-collapse border-gray-200 table-auto">
              <thead>
                <tr>
                <th className="px-4 py-2 border border-gray-300">ID</th>
                  <th className="px-4 py-2 border border-gray-300">Sender</th>
                  <th className="px-4 py-2 border border-gray-300">Receiver</th>
                  <th className="px-4 py-2 border border-gray-300">Amount</th>
                  <th className="px-4 py-2 border border-gray-300">Charge</th>
                  <th className="px-4 py-2 border border-gray-300">Profit</th>
                  <th className="px-4 py-2 border border-gray-300">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2 border border-gray-300">{transaction.id}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.senderno}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.receiverno}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.amount}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.charge}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.profit.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


      </main>
    </div>
  );
}

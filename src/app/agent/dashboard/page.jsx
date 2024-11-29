"use client";
import { useState, useEffect } from "react";
import axios from "axios";
export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ no: "", amount: "" });
  const [selectedFeature, setSelectedFeature] = useState("");
  const [balance, setBalance] = useState(null);
  const [profit, setProfit] = useState(null);
  const [message, setMessage] = useState("");
  const [senderNo, setSenderNo] = useState(""); // For storing sender's number from sessionStorage
  const [tableName, setTablename] = useState(""); // For storing sender's number from sessionStorage
  const [name, setName] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("All Transactions");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    update();
  }, []);

  const update = ()  =>{
    const storedNo = sessionStorage.getItem("no");
    const tablename = sessionStorage.getItem("tablename");
    if (storedNo && tablename) {
      setSenderNo(storedNo);
      setTablename(tablename);
      fetchBalance(storedNo,tablename);
      fetchAllTransactions(storedNo)
      fetchProfit()
    }
    
  }
  
  console.log(tableName,"tableName");
  const fetchBalance = async (no,tableName) => {
    try {
      const res = await fetch("http://localhost:5000/api/show-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no, tablename: tableName}),
      });

      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setName(data.name);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };
  const fetchProfit = async () => {
    const storedNo = sessionStorage.getItem("no");
    try {
      const res = await fetch("http://localhost:5000/api/agent_profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no : storedNo}),
      });

      const data = await res.json();
      if (res.ok) {
        setProfit(data.agent_profit);
      } if(data.agent_profit === null){
        setProfit(0)
      }else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  



  const handleSendMoney = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/userCashIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          senderNo,         
          receiverNo: formData.no,
          amount: formData.amount,
          transactionType: "Send Money",
        }),
      });

      const data = await res.json();
      
      

      if (res.ok) {
        setMessage(data.message);
        setShowPopup(false);
        setFormData({ no: "", amount: "" });
        update();
        setTimeout(() => {
          setMessage()
        }, 3000);
      } else {
        setMessage(data.error);
      }

      
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }

    
  };
  const handleAgentWithdraw = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/agentWithdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({          
          no: senderNo,
          amount: formData.amount,
          transactionType: "Withdraw",
        }),
      });

      const data = await res.json();
      
      

      if (res.ok) {
        setMessage(data.message);
        setShowPopup(false);
        setFormData({ no: "", amount: "" });
        update();
        setTimeout(() => {
          setMessage()
        }, 3000);
      } else {
        setMessage(data.error);
      }

      
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }

    
  };
  
 




  const features = [
    { title: "User Cashin", icon: "💸", handler: handleSendMoney },
    { title: "Withdraw", icon: "💸", handler: handleAgentWithdraw }
  ];

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature.title);
    setShowPopup(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedHandler = features.find((f) => f.title === selectedFeature)?.handler;
    if (selectedHandler) {
      selectedHandler();
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  


 






  const fetchAllTransactions = async (senderNo) => {
    try {
      setError('')
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/agent_transection", { senderNo });
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
      const res = await axios.post(`http://localhost:5000/api/${endpoint}`, { senderNo });
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
        <h1 className="text-4xl font-bold">Agent Dashboard</h1>
      </header>

  <main className="p-6">
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-semibold text-gray-100">Balance:</h2>
      <p className="text-xl font-bold text-green-300 " >{balance !== null ? `${balance} Taka` : "Loading..."}</p>
    </div>
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-semibold text-gray-100">Profit:</h2>
      <p className="text-xl font-bold text-green-300">{profit !== null ? `${profit.toFixed(2)} Taka` : "Loading..."}</p>
    </div>

    <div className="gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          onClick={() => handleFeatureClick(feature)}
          className="flex justify-center p-6 mb-2 text-center transition duration-200 transform bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:scale-101"
        >
          <div className="text-5xl">{feature.icon}</div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{feature.title}</h2>
        </div>
      ))}
    </div>
  </main>

  {message && (
    <div className={`text-center p-4 ${message.includes("successful") ? "text-green-600" : "text-red-600"} bg-white font-bold`}>
      {message}
    </div>
  )}

  {showPopup && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{selectedFeature}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
        {selectedFeature !== "Withdraw" && (
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
        )}

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
          <button onClick={() => fetchTransactionsByType("agent_transection_CashOut", "User CashOut")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          User CashOut
          </button>
          <button onClick={() => fetchTransactionsByType("agent_transection_UserCashIn", "User CashIn")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          User CashIn
          </button>
          <button onClick={() => fetchTransactionsByType("agent_transection_agentCashIn", "Agent CashIn")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          Agent CashIn
          </button>
          <button onClick={() => fetchTransactionsByType("agent_transection_withdraw", "Withdraw")} className="px-4 py-2 bg-white rounded-md hover:bg-red-600">
          Withdraw
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
                  <th className="px-4 py-2 border border-gray-300">Number</th>
                  <th className="px-4 py-2 border border-gray-300">Amount</th>
                  <th className="px-4 py-2 border border-gray-300">Profit</th>
                  <th className="px-4 py-2 border border-gray-300">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2 border border-gray-300">{transaction.id}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.no}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.amount}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.profit.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300">{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


  </div>

  )
}

"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ no: "", amount: "" });
  const [selectedFeature, setSelectedFeature] = useState("");
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("");
  const [senderNo, setSenderNo] = useState(""); // For storing sender's number from localStorage

  useEffect(() => {
    const storedNo = localStorage.getItem("no");
    if (storedNo) {
      setSenderNo(storedNo);
      fetchBalance(storedNo);
    }
  }, []);

  const fetchBalance = async (no) => {
    try {
      const res = await fetch("http://localhost:5000/api/show-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no }),
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

  const handleSendMoney = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sendmoney", {
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
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleCashout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderNo,
          amount: formData.amount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setShowPopup(false);
        setFormData({ no: "", amount: "" });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderNo,
          amount: formData.amount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setShowPopup(false);
        setFormData({ no: "", amount: "" });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleMobileRecharge = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderNo,
          amount: formData.amount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setShowPopup(false);
        setFormData({ no: "", amount: "" });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const features = [
    { title: "Send Money", icon: "💸", handler: handleSendMoney },
    { title: "Cashout", icon: "🏧", handler: handleCashout },
    { title: "Payment", icon: "💳", handler: handlePayment },
    { title: "Mobile Recharge", icon: "📱", handler: handleMobileRecharge },
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-pink-700 text-white">
  <header className="py-6 text-center bg-pink-700">
    <h1 className="text-4xl font-bold">Wallet Dashboard</h1>
    <p className="text-sm mt-2">Manage your transactions seamlessly.</p>
  </header>

  <main className="p-6">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-100">Your Balance:</h2>
      <p className="text-xl font-bold text-green-300">{balance !== null ? `$${balance}` : "Loading..."}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          onClick={() => handleFeatureClick(feature)}
          className="cursor-pointer p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition transform duration-200 text-center"
        >
          <div className="text-5xl">{feature.icon}</div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{feature.title}</h2>
        </div>
      ))}
    </div>
  </main>

  {message && (
    <div className={`text-center p-4 ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
      {message}
    </div>
  )}

  {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{selectedFeature}</h3>
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
          </div>
          <div className="flex justify-between items-center">
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
</div>

  );
}

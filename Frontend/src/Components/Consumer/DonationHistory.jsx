import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaCheckCircle, FaClock, FaTruck, FaExclamationTriangle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const statusIcons = {
  Pending: { icon: <FaClock className="text-yellow-500" />, label: "Pending" },
  Accepted: { icon: <FaCheckCircle className="text-blue-500" />, label: "Accepted" },
  "Out for Delivery": { icon: <FaTruck className="text-orange-500" />, label: "Out for Delivery" },
  Delivered: { icon: <FaCheckCircle className="text-green-500" />, label: "Delivered" },
  Expired: { icon: <FaExclamationTriangle className="text-red-500" />, label: "Expired" },
};

const DonationHistory = ({ onClose }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const fetchDonations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/donation-history`, {
          withCredentials: true,
        });
        setDonations(response.data.data || []);
      } catch (error) {
        console.error("Error fetching donation history:", error);
        setError("Failed to load donation history");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!donations.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Donation History</h3>
        <p className="text-gray-600">You haven't made any donations yet.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        data-aos="flip-up"
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl transform transition-all duration-500"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Donation History</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition duration-300"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{donation.foodName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{donation.quantity}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(donation.schedulePickUp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    "Pending": "bg-yellow-100 text-yellow-800",
    "Accepted": "bg-blue-100 text-blue-800",
    "Delivered": "bg-green-100 text-green-800",
    "Cancelled": "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default DonationHistory;
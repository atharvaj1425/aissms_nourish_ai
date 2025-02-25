import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Volunteer = () => {
  const [foodDonations, setFoodDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDonations = async () => {
      try {
        const volunteerId = localStorage.getItem("userId");
        if (!volunteerId) {
          throw new Error("Volunteer ID not found in local storage");
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/volunteers/getDonations?volunteerId=${volunteerId}`, {
          withCredentials: true,
        });
        setFoodDonations(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch food donations:", err);
        setIsLoading(false);
      }
    };

    fetchFoodDonations();
  }, []);

  const handleAccept = async (donationId) => {
    try {
      const volunteerId = localStorage.getItem("userId");
      if (!volunteerId) {
        throw new Error("Volunteer ID not found in local storage");
      }
  
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/volunteers/${donationId}/accept`, { volunteerId }, {
        withCredentials: true,
      });
      toast.success("Food donation accepted successfully!");
      setFoodDonations(foodDonations.filter(donation => donation._id !== donationId));
    } catch (err) {
      console.error("Failed to accept food donation:", err);
      toast.error("Failed to accept food donation. Please try again later.");
    }
  };

  const handleReject = async (donationId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/volunteers/${donationId}/reject`, {}, {
        withCredentials: true,
      });
      toast.success("Food donation rejected successfully!");
      setFoodDonations(foodDonations.filter(donation => donation._id !== donationId));
    } catch (err) {
      console.error("Failed to reject food donation:", err);
      toast.error("Failed to reject food donation. Please try again later.");
    }
  };

  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 border border-gray-200 w-full ${foodDonations.length > 0 ? 'min-h-fit' : 'min-h-[300px]'} transition-all duration-300 ease-in-out`}>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4 transition-colors duration-300">
        Food Donations Available
      </h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="w-full">
          <table className="w-full bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr className="transition-colors duration-200">
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Food Name</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Quantity</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Expiry Date</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Schedule Pick Up</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Restaurant Pincode</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Restaurant Name</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foodDonations.map((donation) => (
                <tr 
                  key={donation._id} 
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="py-3 px-4 text-xs text-gray-800">{donation.foodName}</td>
                  <td className="py-3 px-4 text-xs text-gray-800">{donation.quantity}</td>
                  <td className="py-3 px-4 text-xs text-gray-800">{new Date(donation.expiryDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-xs text-gray-800">{new Date(donation.schedulePickUp).toLocaleString()}</td>
                  <td className="py-3 px-4 text-xs text-gray-800">{donation.restaurantPincode}</td>
                  <td className="py-3 px-4 text-xs text-gray-800">{donation.restaurantName}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(donation._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(donation._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Volunteer;
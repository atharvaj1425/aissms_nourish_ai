import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBox, FaCalendarAlt, FaCheckCircle, FaClipboardCheck, FaHourglassHalf, FaTimesCircle} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { MdOutlineDeliveryDining } from "react-icons/md";
import { MdOutlineMobileFriendly } from "react-icons/md";
const FoodDonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');

        if (!accessToken || !userId) {
          console.error('No access token or user ID found');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/restaurants/donationHistory`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        setDonations(response.data.data.sort((a, b) => new Date(b.schedulePickUp) - new Date(a.schedulePickUp)));
      } catch (error) {
        console.error('Error fetching donation history:', error);
      }
    };
    fetchDonations();
  }, []);

  // Status Icon Mapping
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaHourglassHalf className="inline text-yellow-500 mr-2 text-xl" />;
      case 'accepted':
        return <FaCheckCircle className="inline text-blue-500 mr-2 text-xl" />;
      case 'delivered':
        return <FaClipboardCheck className="inline text-green-600 mr-2 text-xl" />;
      case 'rejected':
        return <FaTimesCircle className="inline text-red-500 mr-2 text-xl" />;
      default:
        return <MdOutlineDeliveryDining className="inline text-orange-600 mr-2 text-2xl" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/retailer')}
          className="p-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-300"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <motion.h2
          className="text-3xl font-bold text-gray-800 flex items-center gap-3 justify-center w-full text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaBox className="text-green-600" /> Food Donation History
        </motion.h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <motion.table
          className="w-full border-collapse bg-white overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="py-3 px-6 text-left">Food Name</th>
              <th className="py-3 px-6 text-center">Quantity</th>
              <th className="py-3 px-6 text-center">Expiry Date</th>
              <th className="py-3 px-6 text-center">Pick-up Date</th>
              <th className="py-3 px-6 text-center">Food Type</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {donations.length > 0 ? (
              donations.map((donation, index) => (
                <motion.tr
                  key={donation._id}
                  className="border-b border-gray-300 hover:bg-gray-100 transition duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="py-3 px-6">{donation.foodName}</td>
                  <td className="py-3 px-6 text-center">{donation.quantity}</td>
                  <td className="py-3 px-6 text-center">
                    <FaCalendarAlt className="inline text-gray-500 mr-2" />
                    {new Date(donation.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <FaCalendarAlt className="inline text-gray-500 mr-2" />
                    {new Date(donation.schedulePickUp).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">{donation.foodType}</td>
                  <td className="py-3 px-6 text-center font-semibold">
                    {getStatusIcon(donation.status)}
                    {donation.status}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No donation history available.
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default FoodDonationHistory;

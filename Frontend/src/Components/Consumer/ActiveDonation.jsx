import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaTimes, FaCheckCircle, FaMapMarkerAlt, FaBoxOpen, FaCalendarAlt, FaUser, FaClock, FaTruck, FaArrowRight
} from 'react-icons/fa';

const statusStages = ['Pending', 'Accepted', 'Out for Delivery', 'Delivered'];

const ActiveDonation = ({ onClose }) => {
  const [activeDonation, setActiveDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800 });

    const fetchActiveDonation = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/active-donation`, {
          withCredentials: true,
        });
        setActiveDonation(response.data.data);
      } catch (error) {
        console.error("Error fetching active donation:", error);
        setError('Failed to load active donation');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDonation();
  }, []);

  const getStatusIndex = (status) => statusStages.indexOf(status);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!activeDonation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Active Donations</h3>
        <p className="text-gray-600">You don't have any active donations at the moment.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl transform transition-all duration-500" data-aos="flip-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBoxOpen className="text-green-600" /> Active Donation
          </h2>
          <div className="flex-1 mx-6 flex items-center justify-between relative">
            {/* Progress Bar with Connecting Arrows */}
            {statusStages.map((stage, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: getStatusIndex(activeDonation?.status) >= index ? 1.2 : 1, opacity: getStatusIndex(activeDonation?.status) >= index ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded-full ${getStatusIndex(activeDonation?.status) >= index ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  {index === 0 && <FaClock size={18} />}
                  {index === 1 && <FaCheckCircle size={18} />}
                  {index === 2 && <FaTruck size={18} />}
                  {index === 3 && <FaCheckCircle size={18} />}
                </motion.div>
                <span className="text-xs text-gray-600 mt-2 text-center w-16">{stage}</span>
                {index < statusStages.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0.3, width: '20px' }}
                    animate={{ opacity: getStatusIndex(activeDonation?.status) > index ? 1 : 0.3, width: '40px' }}
                    transition={{ duration: 0.3 }}
                    className="mx-1 flex items-center justify-center"
                  >
                    <FaArrowRight className={`text-lg ${getStatusIndex(activeDonation?.status) > index ? 'text-green-500' : 'text-gray-400'}`} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <button onClick={onClose} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition duration-300">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Loading/Error States */}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {activeDonation && (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse bg-white overflow-hidden rounded-md shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Meal Description</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-center">Pick-up Date</th>
                  <th className="py-3 px-6 text-center">Pincode</th>
                  <th className="py-3 px-6 text-center">Accepted By</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-300">
                  <td className="py-3 px-6">{activeDonation.mealDescription}</td>
                  <td className="py-3 px-6 text-center">{activeDonation.quantity}</td>
                  <td className="py-3 px-6 text-center">
                    <FaCalendarAlt className="inline text-gray-500 mr-2" />
                    {new Date(activeDonation.schedulePickUp).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <FaMapMarkerAlt className="inline text-red-500 mr-2" />
                    {activeDonation.pincode}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <FaUser className="inline text-blue-500 mr-2" />
                    {activeDonation.acceptedBy?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-6 text-center font-semibold">
                    {activeDonation.status}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ActiveDonation;
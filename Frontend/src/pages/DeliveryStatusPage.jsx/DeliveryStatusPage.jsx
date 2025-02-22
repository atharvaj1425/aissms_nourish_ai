import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle, FaClock } from "react-icons/fa";

const DeliveryStatusPage = () => {
  const [deliveryStatus, setDeliveryStatus] = useState([]);

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      try {
        const response = await axios.get("/api/v1/restaurants/deliveryStatus", { withCredentials: true });
        if (response.data.success) {
          // Sort data based on latest pick-up date
          const sortedData = response.data.data.sort(
            (a, b) => new Date(b.schedulePickUp) - new Date(a.schedulePickUp)
          );
          setDeliveryStatus(sortedData);
        }
      } catch (error) {
        console.error("Error fetching delivery status:", error);
      }
    };

    fetchDeliveryStatus();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <FaCheckCircle className="text-green-600 text-lg" />;
      case "Out for Delivery":
        return <FaTruck className="text-yellow-600 text-lg" />;
      case "Completed":
        return <FaCheckCircle className="text-blue-600 text-lg" />;
      case "Expired":
        return <FaTimesCircle className="text-red-600 text-lg" />;
      default:
        return <FaClock className="text-gray-500 text-lg" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Page Title */}
      <motion.h2 
        className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaBox className="text-green-600" /> Delivery Status
      </motion.h2>

      {/* Responsive Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <motion.table 
          className="w-full border-collapse bg-white overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Food Name</th>
              <th className="py-3 px-6 text-center">Quantity</th>
              <th className="py-3 px-6 text-center">Food Type</th>
              <th className="py-3 px-6 text-center">Expiry Date</th>
              <th className="py-3 px-6 text-center">Pick-up Date</th>
              <th className="py-3 px-6 text-center">Accepted By</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {deliveryStatus.length > 0 ? (
              deliveryStatus.map((item, index) => (
                <motion.tr
                  key={item._id}
                  className="border-b border-gray-300 hover:bg-gray-100 transition duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="py-3 px-6">{item.foodName}</td>
                  <td className="py-3 px-6 text-center">{item.quantity}</td>
                  <td className="py-3 px-6 text-center">{item.foodType}</td>
                  <td className="py-3 px-6 text-center">{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center">{new Date(item.schedulePickUp).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center">{item.acceptedBy || "N/A"}</td>
                  <td className="py-3 px-6 text-center flex items-center justify-center gap-2 font-semibold">
                    {getStatusIcon(item.status)}
                    {item.status}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No delivery status available.
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default DeliveryStatusPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, AlertTriangle,UtensilsCrossed, Users } from "lucide-react"; // Icons

const Header_1 = ({ accessToken }) => {
  const [expiringSoonItems, setExpiringSoonItems] = useState([]);
  const [wastePrevented, setWastePrevented] = useState(0);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/restaurants/getFoodItems`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        const items = response.data.data || [];

        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter items expiring in the next 3 days
        const expiringItems = items.filter((item) => {
          if (!item.expiryDate) return false;
          const expiryDate = new Date(item.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);

          const daysDiff = (expiryDate - today) / (1000 * 60 * 60 * 24);
          return daysDiff >= 0 && daysDiff <= 3;
        });

        setExpiringSoonItems(expiringItems);
      } catch (err) {
        console.error("Failed to fetch food items:", err);
      }
    };

    const fetchWastePrevented = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/restaurants/donationHistory`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        const donations = response.data.data || [];

        // Filter donations that are "Delivered" and sum up their quantities
        const totalDelivered = donations
          .filter((donation) => donation.status === "Delivered")
          .reduce((sum, donation) => sum + Number(donation.quantity || 0), 0);

        setWastePrevented(totalDelivered);
      } catch (err) {
        console.error("Failed to fetch waste prevented data:", err.response ? err.response.data : err.message);
      }
    };

    fetchFoodItems();
    fetchWastePrevented();
  }, [accessToken]);

  // Calculate the estimated number of people fed based on waste prevented
  const minPeopleFed = wastePrevented;
  const maxPeopleFed = wastePrevented + 10;

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {/* Expiring Soon Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-300 hover:shadow-xl transition">
        <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          Expiring Soon
        </h3>
        <p className="text-3xl font-bold text-red-600 mt-2">{expiringSoonItems.length} items</p>
        <span className="text-sm text-gray-500">
          {expiringSoonItems.length > 0
            ? `⚠️ ${expiringSoonItems[0].name} expiring soon`
            : "No items expiring soon"}
        </span>
      </div>

      {/* Waste Prevented Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-300 hover:shadow-xl transition">
        <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
          <UtensilsCrossed className="text-green-600 w-6 h-6" />
         Food Distributed
        </h3>
        <p className="text-3xl font-bold text-green-700 mt-2">{wastePrevented} kg</p>
        <span className="text-sm text-red-500">
          {wastePrevented > 0 ? "+8% since last week" : "No waste prevented yet"}
        </span>
      </div>

      {/* Entity Fed Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-300 hover:shadow-xl transition">
        <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
          <Users className="text-blue-600 w-6 h-6" />
          Entity Fed
        </h3>
        <p className="text-3xl font-bold text-blue-700 mt-2">{minPeopleFed}-{maxPeopleFed}</p>
        <span className="text-sm text-red-500">Your impact is growing! 🌱</span>
      </div>

      {/* Active Since Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-300 hover:shadow-xl transition">
        <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
          <Clock className="text-gray-600 w-6 h-6" />
          Active Since
        </h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">6 months</p>
        <span className="text-sm text-gray-500">Consistently helping!</span>
      </div>
    </div>
  );
};

export default Header_1;

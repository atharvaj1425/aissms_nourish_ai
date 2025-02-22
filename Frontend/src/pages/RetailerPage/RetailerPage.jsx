import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '../../Components/Restaurant/SideBar';
import Header from "../../Components/Restaurant/Header_1";
import FoodItemsTable from '../../Components/Restaurant/FoodItemsTable';
import AIRecipe from '../../Components/Restaurant/AIRecipe';
import NavBar from "../../Components/Restaurant/NavBar";
import Analytics from "../../Components/Restaurant/Analytics";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RetailerPage = () => {
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [latestStatus, setLatestStatus] = useState(null);

  useEffect(() => {
    // Retrieve success message
    const successMessage = localStorage.getItem("loginSuccess");

    if (successMessage) {
      toast.success(successMessage);
      localStorage.removeItem("loginSuccess");
    }

    // Retrieve accessToken and userId from localStorage
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");

    if (storedAccessToken && storedUserId) {
      setAccessToken(storedAccessToken);
      setUserId(storedUserId);
    }

    // Fetch the latest delivery status
    const fetchLatestDeliveryStatus = async () => {
      try {
        const response = await axios.get("/api/v1/restaurants/deliveryStatus", {
          withCredentials: true,
        });

        if (response.data.success && response.data.data.length > 0) {
          const latest = response.data.data[response.data.data.length - 1];
          setLatestStatus(latest);

          // Unique key for each food status
          const statusKey = `seenStatus-${latest.foodName}-${latest.status}`;
          const seenStatus = localStorage.getItem(statusKey);

          // Show notification only if this specific status hasn't been seen yet
          if (seenStatus !== "true") {
            handleToastNotification(latest);
            localStorage.setItem(statusKey, "true"); // Mark this status as seen
          }
        }
      } catch (error) {
        console.error("Error fetching delivery status:", error);
      }
    };

    fetchLatestDeliveryStatus();
  }, []); 

  const handleToastNotification = (status) => {
    switch (status.status) {
      case "Accepted":
        toast.success(`Order accepted: ${status.foodName}`);
        break;
      case "Out for Delivery":
        toast.info(`Order out for delivery: ${status.foodName}`);
        break;
      case "Completed":
        toast.success(`Order completed: ${status.foodName}`);
        break;
      case "Expired":
        toast.error(`Order expired: ${status.foodName}`);
        break;
      default:
        toast.success(`Order Delivered ${status.foodName}`);
        break;
    }
  };

  return (
    <div className="animate-fadeIn">
      <NavBar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-6 bg-green-100">
          <Header />

          {/* Main content section with food items and AI Recipe */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-2">
              <FoodItemsTable />
            </div>
            <AIRecipe />
          </div>

          {/* Analytics component */}
          <div className="mt-6">
            <Analytics />
          </div>

          {/* Display Latest Delivery Status if Available */}
          
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted": return "text-green-600 font-bold";
    case "Out for Delivery": return "text-yellow-600 font-bold";
    case "Completed": return "text-blue-600 font-bold";
    case "Expired": return "text-red-600 font-bold";
    default: return "text-gray-600";
  }
};

export default RetailerPage;

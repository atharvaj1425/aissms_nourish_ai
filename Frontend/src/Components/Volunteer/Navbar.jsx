import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaHotel } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import IncomingRedistributionPopup from './IncomingRedistributionPopup';
import RedistributionHistoryPopup from './RedistributionHistoryPopup';

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [showIncomingPopup, setShowIncomingPopup] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const navigate = useNavigate(); // React Router navigation hook

  useEffect(() => {
    // Retrieve name from localStorage when the component is mounted
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name); 
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");

    // Redirect to homepage or login page
    navigate('/');
  };

  return (
    <div className="flex bg-white p-4 rounded-lg border-2 border-black shadow-lg mt-15 w-full justify-between">
      <div className="flex items-center">
        {/* Logo Image beside Dashboard Title */}
        <img src="/consumer.png" alt="Logo" className="w-16 h-16 mr-2" />
        <div className="text-4xl font-semibold">Volunteer Dashboard</div>
      </div>

      {/* Links in the center */}
      <div className="flex items-center space-x-8">
        <div className="text-lg font-bold text-green-800 pb-1 border-b-4 border-green-800">
          Overview
        </div>
        <div className="text-lg font-bold text-black hover:text-green-800 pb-1 border-b-4 border-transparent hover:border-green-800" onClick={() => setShowIncomingPopup(true)}>
          New Redistribution
        </div>
        <div className="text-lg font-bold text-black hover:text-green-800 pb-1 border-b-4 border-transparent hover:border-green-800" onClick={() => setShowHistoryPopup(true)}>
          Redistribution History
        </div>
        <div className="text-lg font-bold text-black hover:text-green-800 pb-1 border-b-4 border-transparent hover:border-green-800">
          Network
        </div>
      </div>

      {/* User Icon with Username and Logout button */}
      <div className="flex items-center">
        <img src="/login.png" alt="Login" className="w-12 h-12 mr-2" />
        <div className="text-lg font-bold mr-4">{userName ? userName : "Guest"}</div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        >
          Logout <FaSignOutAlt className="ml-2" /> {/* Added space with ml-4 */}
        </button>
      </div>

      {/* Popups */}
      <IncomingRedistributionPopup show={showIncomingPopup} onClose={() => setShowIncomingPopup(false)} />
      <RedistributionHistoryPopup show={showHistoryPopup} onClose={() => setShowHistoryPopup(false)} />
    </div>
  );
};

export default Navbar;
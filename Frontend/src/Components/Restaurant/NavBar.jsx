import React, { useEffect, useState } from 'react';
import { FaHotel } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa"; // Added for logout icon
import { useNavigate } from 'react-router-dom'; // Added for navigation
import RestaurantLeaderboardModal from './RestaurantLeaderboardModal'; // Added for Restaurant Leaderboard Modal
const NavBar = () => {
  const [userEmail, setUserEmail] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const navigate = useNavigate(); // React Router hook for navigation
const [userName, setUserName] = useState("");
  useEffect(() => {
    // Retrieve email from localStorage when the component is mounted
    const email = localStorage.getItem("userEmail");
      const username = localStorage.getItem("userName");
    if (email) {
      setUserEmail(email);
    }
      if (username) {
        setUserName(username); 
      }
  }, []);

  const handleLogout = () => {
    // Clear access token and user email from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");

    // Redirect to Homepage and replace the current history entry so they can't go back
    navigate('/', { replace: true });
  };

  return (
    <div className="flex bg-white p-4 rounded-lg border-2 border-black shadow-lg mt-15 w-full justify-between">
      <div className="flex items-center">
        {/* Restaurant Image beside Retailer Dashboard */}
        <img src="/restro.png" alt="Restaurant" className="w-16 h-16 mr-2" />
        <div className="text-4xl font-semibold">Restaurant Dashboard</div>
      </div>

      {/* Links in the center */}
      <div className="flex items-center space-x-8">
        <div className="text-lg font-bold text-green-800 pb-1 border-b-4 border-green-800">
          Overview
        </div>
        <div className="text-lg font-bold text-black hover:text-green-800 pb-1 border-b-4 border-transparent hover:border-green-800">
          All Data
        </div>
        <div className="text-lg font-bold text-black hover:text-green-800 pb-1 border-b-4 border-transparent hover:border-green-800">
          Individual Data
        </div>
        <div className="text-lg font-bold text-black hover:text-green-800 pb-1 border-b-4 border-transparent hover:border-green-800">
          Current 
        </div>
        <div className="text-lg font-bold text-black hover:text-green-800 pb-1 border-b-4 border-transparent hover:border-green-800 cursor-pointer"
          onClick={() => setShowLeaderboard(true)}>
            Leaderboard
        </div>
      </div>

      {/* User Icon with Username and Logout button */}
      <div className="flex items-center">
        {/* Login Image beside APMC */}
        <img src="/login.png" alt="Login" className="w-12 h-12 mr-2" />
        <div className="text-lg font-bold mr-4">{userName  ? userName  : "Guest"}</div>

        {/* Logout Button with React Icon */}
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        >
              Logout <FaSignOutAlt className="ml-2" />
        </button>
      </div>
      {showLeaderboard && <RestaurantLeaderboardModal onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
};

export default NavBar;

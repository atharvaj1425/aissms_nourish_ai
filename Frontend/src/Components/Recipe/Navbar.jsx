import React from 'react';
import { FaArrowRightToBracket } from 'react-icons/fa6'; // Corrected import path

const Navbar = () => {
  return (
    <nav className="bg-white text-gray-800 py-4 px-6 flex justify-between items-center shadow-md">
      {/* Left side: Logo with text */}
      <div className="flex items-center">
        <img
          src="/tasty.png" // Replace with your image name in the public folder
          alt="Delicious Logo"
          className="h-10 w-10 mr-2"
        />
        <h1 className="text-3xl font-bold">RecipeWhiz</h1>
      </div>

      {/* Right side: Chatbot button with icon */}
      <button 
        className="flex items-center text-white bg-green-900 focus:outline-none text-xl font-bold px-4 py-2 rounded"
        onClick={() => window.location.href='/recipe-bot'}
      >
        <span className="mr-2">Generate Recipe</span>
        <FaArrowRightToBracket className="h-8 w-8" />
      </button>
    </nav>
  );
};

export default Navbar;

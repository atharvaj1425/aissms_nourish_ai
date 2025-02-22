import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaBoxOpen, FaCalendarAlt, FaSortNumericUp, FaCalendarTimes, FaCheckCircle, 
  FaTimes, FaQuoteLeft, FaQuoteRight, FaMicrophone 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const FoodInventory = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturingDate: '',
    quantity: '',
    expiryDate: '',
  });
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const quote = "Every meal shared is a step towards a better world.";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData((prevData) => ({ ...prevData, name: transcript }));
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error('Voice input failed. Please try again.');
      setIsListening(false);
    };
  };

  const handleAddFoodItem = async () => {
    const { name, manufacturingDate, quantity, expiryDate } = formData;
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    if (!name || !manufacturingDate || !quantity || !expiryDate) {
      toast.error('Please fill in all fields!');
      return;
    }

    if (expiryDate < today) {
      toast.error('Expiry date cannot be before today!');
      return;
    }

    if (manufacturingDate > today) {
      toast.error('Manufacturing date cannot be in the future!');
      return;
    }

    try {
      await axios.post("/api/v1/users/addFoodItem", formData);
      
      toast.success('Food item added successfully!');
      
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      toast.error('Failed to add food item. Please try again later.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-lg max-h-[90vh] overflow-y-auto relative"
        data-aos="flip-up"
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Title with Bounce Animation */}
        <div className="text-center space-y-2">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FaBoxOpen className="text-5xl text-green-600 mx-auto" />
          </motion.div>
          <h1 className="text-2xl font-bold">Food Inventory</h1>
        </div>

        {/* Quote */}
        <div className="text-center my-4 text-gray-600 italic flex justify-center items-center">
          <FaQuoteLeft className="text-green-500 mr-2" />
          <span>{quote}</span>
          <FaQuoteRight className="text-green-500 ml-2" />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="relative">
            <label className="block font-semibold">Food Item Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md pr-10"
              placeholder="Enter food item name"
            />
            <button
              onClick={handleVoiceInput}
              className="absolute right-2 top-9 text-gray-600 hover:text-green-600"
            >
              <FaMicrophone className={`text-xl ${isListening ? 'animate-pulse text-green-600' : ''}`} />
            </button>
          </div>

          <div>
            <label className="block font-semibold">Manufacturing Date:</label>
            <input
              type="date"
              name="manufacturingDate"
              value={formData.manufacturingDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block font-semibold">Expiry Date:</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            onClick={handleAddFoodItem}
            className="w-full p-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition flex justify-center items-center"
          >
            Add Food Item <FaCheckCircle className="ml-2" />
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default FoodInventory;
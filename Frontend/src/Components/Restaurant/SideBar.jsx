import React, { useState, useEffect } from 'react';
import { RiComputerLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { IoAnalytics, IoFastFood } from "react-icons/io5";
import { BiLeaf } from "react-icons/bi";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import Form from '../../Components/Donation/Form';
import FoodInventory from '../../pages/FoodDetection/FoodDetection';
import axios from 'axios';

// Set the app element for react-modal
Modal.setAppElement('#root');

const Sidebar = () => {
  const [formModalIsOpen, setFormModalIsOpen] = useState(false);
  const [donateFormModalIsOpen, setDonateFormModalIsOpen] = useState(false);
  const [foodItems, setFoodItems] = useState([]);

  const openFormModal = () => {
    setFormModalIsOpen(true);
  };

  const closeFormModal = () => {
    setFormModalIsOpen(false);
  };

  const openDonateFormModal = () => {
    setDonateFormModalIsOpen(true);
  };

  const closeDonateFormModal = () => {
    setDonateFormModalIsOpen(false);
  };

  const updateFoodItems = (newItem) => {
    setFoodItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <div className="w-1/5 bg-gray-900 text-white p-6 h-[120vh] flex flex-col">
      {/* Logo Section */}
      <div>
        <h2 className="text-3xl font-bold mb-12 flex items-center">
          <BiLeaf className="mr-3 text-green-500 text-4xl" /> Nourish AI
        </h2>
        {/* Navigation Menu */}
        <ul className="space-y-8 text-lg text-center mr-16">
          <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200">
            <RiComputerLine className="mr-3 text-2xl" /> Dashboard
          </li>
          <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7" onClick={openFormModal}>
            <SlCalender className="mr-3 text-2xl" /> Add Food Items
          </li>
          <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
            <IoAnalytics className="mr-3 text-2xl" /> Daily Food Analysis
          </li>
          <Link to="/donate">
            <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
              <IoFastFood className="mr-3 text-2xl" /> Food Donation
            </li>
          </Link>
          <Link to="/delivery-status">
            <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
              <IoFastFood className="mr-3 text-2xl" /> Delivery Status
            </li>
          </Link>
        </ul>
        {/* Donate Section */}
        <div className="text-center mt-20">
          <p className="text-2xl font-semibold mb-2 whitespace-nowrap">Having Surplus Food?</p>
          <img src="/food-donation.png" alt="Donate Food" className="w-24 h-24 mb-4 mx-auto rounded-full shadow-md" />
          <button className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition duration-300 shadow-lg" onClick={openDonateFormModal}>
            Donate Food
          </button>
        </div>
        {/* Display User Info */}
      </div>

      {/* Modal for Add Food Items */}
      <Modal
        isOpen={formModalIsOpen}
        onRequestClose={closeFormModal}
        contentLabel="Add Food Items"
         className="modal bg-white rounded-xl shadow-2xl w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto transform transition-all duration-300 ease-in-out animate-fade-in-up"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
       
      >
        <FoodInventory closeModal={closeFormModal} updateFoodItems={updateFoodItems} />
      </Modal>

      {/* Modal for Donate Food */}
      <Modal
        isOpen={donateFormModalIsOpen}
        onRequestClose={closeDonateFormModal}
        contentLabel="Donate Food"
         className="modal bg-white rounded-xl shadow-2xl w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto transform transition-all duration-300 ease-in-out animate-fade-in-up"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <Form closeModal={closeDonateFormModal} updateFoodItems={updateFoodItems} />
      </Modal>
    </div>
  );
};

export default Sidebar;
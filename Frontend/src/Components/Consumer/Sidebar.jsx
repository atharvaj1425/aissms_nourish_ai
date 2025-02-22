// import React from 'react';
// import { RiComputerLine } from "react-icons/ri";
// import { SlCalender } from "react-icons/sl";
// import { IoAnalytics, IoFastFood } from "react-icons/io5";
// import { GiTrophiesShelf } from "react-icons/gi";
// import { BiLeaf } from "react-icons/bi";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="w-1/5 bg-gray-900 text-white p-6 h-[120vh] flex flex-col">
//       {/* Logo Section */}
//       <div>
//         <h2 className="text-3xl font-bold mb-12 flex items-center">
//           <BiLeaf className="mr-3 text-green-500 text-4xl" /> Nourish AI
//         </h2>

//         {/* Navigation Menu */}
//         <ul className="space-y-8 text-lg text-center mr-16">
//           <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200mt-7s">
//             <RiComputerLine className="mr-3 text-2xl" />
//             Dashboard
//           </li>

//           <Link to="/recipe">
//             <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
//               <SlCalender className="mr-3 text-2xl" />
//                Recipe
//             </li>
//           </Link>

//           <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
//             <IoAnalytics className="mr-3 text-2xl" />
//             Real-time Analysis
//           </li>

//           <Link to="/consumer-form">
//   <li className="flex items-center hover:text-green-400 cursor-pointer  mt-7 px-1 py-2 rounded-lg mt-7">
//     <IoFastFood className="mr-3 text-2xl" />
//     Add Food Items
//   </li>
// </Link>

//           <Link to ="getSingleMeal">
//           <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
//             <GiTrophiesShelf className="mr-3 text-2xl" />
//             Get Single Meal
//           </li>
//           </Link>
//         </ul>


//         {/* Donate Section (Moved Here) */}
//         <div className="text-center mt-20">
//           <p className="text-2xl font-semibold mb-2 whitespace-nowrap">
//             Having Surplus Food?
//           </p>
//           <img
//             src="/food-donation.png"
//             alt="Donate Food"
//             className="w-24 h-24 mb-4 mx-auto rounded-full shadow-md"
//           />
//           <Link to = "/single-meal">
//                     <button className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition duration-300 shadow-lg">
//                       Donate Food
//                     </button>
//                     </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import { RiComputerLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { IoAnalytics, IoFastFood } from "react-icons/io5";
import { GiTrophiesShelf } from "react-icons/gi";
import { BiLeaf } from "react-icons/bi";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import AddItem from '../../pages/userAddItem/AddItem';
import DonateSingleMeal from '../../pages/DonateSingleMeal/donate';

// Set the app element for react-modal
Modal.setAppElement('#root');

const Sidebar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [donateModalIsOpen, setDonateModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openDonateModal = () => {
    setDonateModalIsOpen(true);
  };

  const closeDonateModal = () => {
    setDonateModalIsOpen(false);
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
          <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200mt-7s">
            <RiComputerLine className="mr-3 text-2xl" />
            Dashboard
          </li>

          <Link to="/recipe">
            <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
              <SlCalender className="mr-3 text-2xl" />
               Recipe
            </li>
          </Link>

          <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
            <IoAnalytics className="mr-3 text-2xl" />
            Real-time Analysis
          </li>

          <li className="flex items-center hover:text-green-400 cursor-pointer mt-7 px-1 py-2 rounded-lg mt-7" onClick={openModal}>
            <IoFastFood className="mr-3 text-2xl" />
            Add Food Items
          </li>

          {/* <li className="flex items-center hover:text-green-400 cursor-pointer mt-7 px-1 py-2 rounded-lg mt-7" onClick={openDonateModal}>
            <IoFastFood className="mr-3 text-2xl" />
            Donate Single Meal
          </li> */}

          <Link to ="getSingleMeal">
          <li className="flex items-center hover:text-green-400 cursor-pointer transition duration-200 mt-7">
            <GiTrophiesShelf className="mr-3 text-2xl" />
            Get Single Meal
          </li>
          </Link>
        </ul>

        {/* Donate Section (Moved Here) */}
        <div className="text-center mt-20">
          <p className="text-2xl font-semibold mb-2 whitespace-nowrap">
            Having Surplus Food?
          </p>
          <img
            src="/food-donation.png"
            alt="Donate Food"
            className="w-24 h-24 mb-4 mx-auto rounded-full shadow-md"
          />
          
                    <button className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition duration-300 shadow-lg" onClick={openDonateModal}>
                      Donate Food
                    </button>
                    
        </div>
      </div>

      {/* Modal for Add Food Items */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Food Item"
        className="modal bg-white rounded-xl shadow-2xl w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto transform transition-all duration-300 ease-in-out animate-fade-in-up"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <AddItem closeModal={closeModal} />
      </Modal>

      {/* Modal for Donate Single Meal */}
      <Modal
        isOpen={donateModalIsOpen}
        onRequestClose={closeDonateModal}
        contentLabel="Donate Single Meal"
         className="modal bg-white rounded-xl shadow-2xl w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto transform transition-all duration-300 ease-in-out animate-fade-in-up"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <DonateSingleMeal closeModal={closeDonateModal} />
      </Modal>
    </div>
  );
};

export default Sidebar;
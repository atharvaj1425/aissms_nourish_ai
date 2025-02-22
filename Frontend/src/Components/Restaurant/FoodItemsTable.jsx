// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const FoodItemsTable = () => {
//   const [foodItems, setFoodItems] = useState([]);
//   const [statusChanged, setStatusChanged] = useState(false);

//   useEffect(() => {
//     const fetchFoodItems = async () => {
//       try {
//         const response = await axios.get("/api/v1/restaurants/getFoodItems", {
//           withCredentials: true,
//         });
//         setFoodItems(response.data.data);
//       } catch (err) {
//         console.error("Failed to fetch food items:", err);
//         toast.error("Failed to fetch food items");
//       }
//     };

//     fetchFoodItems();
//   }, []); // No need for statusChanged state anymore

//   const fetchFoodItems = async () => {
//     try {
//       console.log("Fetching food items...");
//       const response = await axios.get("/api/v1/restaurants/getFoodItems", {
//         withCredentials: true,
//       });
//       console.log("Received food items:", response.data);
//       setFoodItems(response.data.data);
//     } catch (err) {
//       console.error("Failed to fetch food items:", err);
//       toast.error("Failed to fetch food items");
//     }
//   };

//   const handleUseItem = async (itemId) => {
//     try {
//         const response = await axios.put(
//             `/api/v1/restaurants/updateFoodItemStatus/${itemId}`,
//             { status: "used" }, // Now correctly passing the new status
//             { withCredentials: true }
//         );

//         console.log("API Response:", response.data);

//         if (response.data.success) {
//             toast.success("Food item marked as used successfully!");

//             // Instead of removing, update the status in state
//             setFoodItems(foodItems.map(item =>
//                 item._id === itemId ? { ...item, status: "used" } : item
//             ));
//         }
//     } catch (error) {
//         console.error("Failed to mark item as used:", error);
//         toast.error(error.response?.data?.message || "Failed to mark item as used");
//     }
// };

//   return (
//     <div className="bg-white shadow rounded-lg p-4 border border-black">
//       <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr>
//               <th className="text-left p-2 border-b">Name</th>
//               <th className="text-left p-2 border-b">Manufacturing Date</th>
//               <th className="text-left p-2 border-b">Quantity</th>
//               <th className="text-left p-2 border-b">Expiry Date</th>
//               <th className="text-left p-2 border-b">Status</th>
//               <th className="text-left p-2 border-b">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {foodItems.length > 0 ? (
//               foodItems.map((item) => (
//                 <tr key={item._id} className="hover:bg-gray-100">
//                   <td className="p-2 border-b flex items-center gap-2">
//                     <img src="/diet.png" alt="Food Icon" className="w-6 h-6" />
//                     {item.name.toUpperCase()}
//                   </td>
//                   <td className="p-2 border-b">
//                     {new Date(item.manufacturingDate).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </td>
//                   <td className="p-2 border-b">{item.quantity}</td>
//                   <td className="p-2 border-b">
//                     {new Date(item.expiryDate).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </td>
//                   <td
//                     className={`p-2 border-b ${item.status === "expiring soon"
//                       ? "text-yellow-600 font-bold"
//                       : "text-green-600 font-bold"
//                       }`}
//                   >
//                     {item.status}
//                   </td>
//                   <td className="p-2 border-b">
//                     {(item.status === "expiring soon" || item.status === "good") && (
//                       <button
//                         onClick={() => handleUseItem(item._id)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//                       >
//                         Use
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="p-4 text-center text-gray-500">
//                   No food items available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FoodItemsTable;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FoodItemsTable = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputQuantity, setInputQuantity] = useState("");

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      console.log("Fetching food items...");
      const response = await axios.get("/api/v1/restaurants/getFoodItems", {
        withCredentials: true,
      });
      console.log("Received food items:", response.data);
      setFoodItems(response.data.data);
    } catch (err) {
      console.error("Failed to fetch food items:", err);
      toast.error("Failed to fetch food items");
    }
  };

  const handleUseItemClick = (item) => {
    setSelectedItem(item);
    setInputQuantity(""); // Reset input field
    setShowModal(true);
  };

  const handleUseItemSubmit = async () => {
    if (!selectedItem || inputQuantity === "") {
      toast.warn("Please enter a valid quantity");
      return;
    }

    const useQty = parseInt(inputQuantity);
    if (useQty <= 0 || useQty > selectedItem.quantity) {
      toast.warn("Invalid quantity entered!");
      return;
    }

    const newQuantity = selectedItem.quantity - useQty;
    const newStatus = newQuantity === 0 ? "used" : selectedItem.status;

    try {
      const response = await axios.put(
        `/api/v1/restaurants/updateFoodItemStatus/${selectedItem._id}`,
        { status: newStatus, quantity: newQuantity },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Food item updated successfully!");

        setFoodItems(foodItems.map(item =>
          item._id === selectedItem._id
            ? { ...item, quantity: newQuantity, status: newStatus }
            : item
        ));

        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update food item");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 border border-black">
      <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b">Name</th>
              <th className="text-left p-2 border-b">Manufacturing Date</th>
              <th className="text-left p-2 border-b">Quantity</th>
              <th className="text-left p-2 border-b">Expiry Date</th>
              <th className="text-left p-2 border-b">Status</th>
              <th className="text-left p-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.length > 0 ? (
              foodItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td className="p-2 border-b flex items-center gap-2">
                    <img src="/diet.png" alt="Food Icon" className="w-6 h-6" />
                    {item.name.toUpperCase()}
                  </td>
                  <td className="p-2 border-b">
                    {new Date(item.manufacturingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-2 border-b">{item.quantity}</td>
                  <td className="p-2 border-b">
                    {new Date(item.expiryDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    className={`p-2 border-b ${
                      item.quantity === 0 || item.status === "used"
                        ? "text-red-600 font-bold"
                        : item.status === "expiring soon"
                        ? "text-yellow-600 font-bold"
                        : "text-green-600 font-bold"
                    }`}
                  >
                    {item.quantity === 0 ? "used" : item.status}
                  </td>
                  <td className="p-2 border-b">
                    {item.quantity > 0 && (
                      <button
                        onClick={() => handleUseItemClick(item)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Use
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No food items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Enter Quantity to Use</h2>
            <input
              type="number"
              min="1"
              max={selectedItem.quantity}
              value={inputQuantity}
              onChange={(e) => setInputQuantity(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUseItemSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemsTable;
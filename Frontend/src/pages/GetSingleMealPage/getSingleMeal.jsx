// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const GetSingleMeal = () => {
//   const [meals, setMeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch meals from the backend
//   useEffect(() => {
//     const fetchMeals = async () => {
//       try {
//         const response = await axios.get('/api/v1/users/getMeal');
//         if (response.data && response.data.data) {
//           setMeals(response.data.data);
//           console.log(response.data.data);
//         } else {
//           setError('No meals available');
//         }
//       } catch (err) {
//         console.error("Error fetching meals:", err);
//         setError('Failed to load meals');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeals();
//   }, []);

//   if (loading) return <div>Loading meals...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="bg-white shadow rounded-lg p-4 border border-black w-full min-h-screen">
//       <h2 className="text-xl font-bold mb-4">Available Meals</h2>
//       {meals.length > 0 ? (
//         <table className="min-w-full bg-white border border-gray-300 border-collapse">
//           <thead>
//             <tr className="hover:bg-gray-100">
//               <th className="py-2 px-4 border-b">Meal Description</th>
//               <th className="py-2 px-4 border-b">Quantity</th>
//               <th className="py-2 px-4 border-b">Pick-up Date</th>
//               <th className="py-2 px-4 border-b">Pincode</th>
//               <th className="py-2 px-4 border-b">Donor</th>
//             </tr>
//           </thead>
//           <tbody>
//             {meals.map((meal) => (
//               <tr key={meal._id} className="hover:bg-gray-100">
//                 <td className="py-2 px-4 border-b">{meal.mealDescription}</td>
//                 <td className="py-2 px-4 border-b">{meal.quantity}</td>
//                 <td className="py-2 px-4 border-b">{new Date(meal.schedulePickUp).toLocaleDateString()}</td>
//                 <td className="py-2 px-4 border-b">{meal.pincode}</td>
//                 <td className="py-2 px-4 border-b">{meal.donor ? meal.donor.name : 'Unknown'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <div>No meals available at the moment.</div>
//       )}
//     </div>
//   );
// };

// export default GetSingleMeal;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const GetSingleMeal = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meals from the backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/getMeal`);
        if (response.data && response.data.data) {
          setMeals(response.data.data);
          console.log(response.data.data);
        } else {
          setError('No meals available');
        }
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError('Failed to load meals');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleAccept = async (mealId) => {
    try {
      const userId = localStorage.getItem("userId"); // Retrieve userId from local storage
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/meals/${mealId}/accept`, { userId }, {
        withCredentials: true,
      });
      toast.success("Meal accepted successfully!");
      setMeals(meals.filter(meal => meal._id !== mealId));
    } catch (err) {
      console.error("Failed to accept meal:", err);
      toast.error("Failed to accept meal. Please try again later.");
    }
  };

  const handleReject = async (mealId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/meals/${mealId}/reject`, {}, {
        withCredentials: true,
      });
      toast.success("Meal rejected successfully!");
      setMeals(meals.filter(meal => meal._id !== mealId));
    } catch (err) {
      console.error("Failed to reject meal:", err);
      toast.error("Failed to reject meal. Please try again later.");
    }
  };

  if (loading) return <div>Loading meals...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-4 border border-black w-full min-h-screen">
      <h2 className="text-xl font-bold mb-4">Available Meals</h2>
      {meals.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 border-collapse">
          <thead>
            <tr className="hover:bg-gray-100">
              <th className="py-2 px-4 border-b">Meal Description</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Pick-up Date</th>
              <th className="py-2 px-4 border-b">Pincode</th>
              <th className="py-2 px-4 border-b">Donor</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{meal.foodName}</td>
                <td className="py-2 px-4 border-b">{meal.quantity}</td>
                <td className="py-2 px-4 border-b">{new Date(meal.schedulePickUp).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{meal.pincode}</td>
                <td className="py-2 px-4 border-b">{meal.donor ? meal.donor.name : 'Unknown'}</td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <button
                    onClick={() => handleAccept(meal._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(meal._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No meals available at the moment.</div>
      )}
      <ToastContainer />
    </div>
  );
};

export default GetSingleMeal;
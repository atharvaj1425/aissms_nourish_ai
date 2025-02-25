import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SingleMealStatus = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/active-meals`, {
          withCredentials: true,
        });
        setMeals(response.data.data);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const updateStatus = async (mealId, newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/users/update-status/${mealId}`, {
        status: newStatus,
      });
      setMeals(meals.map(meal => meal._id === mealId ? { ...meal, status: newStatus } : meal));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
    setUpdating(false);
  };

  const getRoute = (meal) => {
    if (!meal) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const destination = encodeURIComponent(`${meal.donor.name}, ${meal.pincode}`);
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
          window.open(googleMapsUrl, "_blank");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get your location. Please enable GPS.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Force fresh location
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 border border-black w-full min-h-screen">
      {loading ? (
        <div>Loading...</div>
      ) : meals.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 border-collapse">
          <thead>
            <tr className="hover:bg-gray-100">
              <th className="py-2 px-4 border-b">Meal Description</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Pick-up Date</th>
              <th className="py-2 px-4 border-b">Pincode</th>
              <th className="py-2 px-4 border-b">Donor</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{meal.mealDescription}</td>
                <td className="py-2 px-4 border-b">{meal.quantity}</td>
                <td className="py-2 px-4 border-b">{new Date(meal.schedulePickUp).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{meal.pincode}</td>
                <td className="py-2 px-4 border-b">{meal.donor ? meal.donor.name : 'Unknown'}</td>
                <td className="py-2 px-4 border-b">{meal.status}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => getRoute(meal)}>
                    Get Route
                  </button>
                  {meal.status === "Accepted" && (
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 ml-2 rounded"
                      onClick={() => updateStatus(meal._id, "Out for Delivery")}
                      disabled={updating}
                    >
                      Picked Up
                    </button>
                  )}
                  {meal.status === "Out for Delivery" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 ml-2 rounded"
                      onClick={() => updateStatus(meal._id, "Delivered")}
                      disabled={updating}
                    >
                      Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No meals available.</div>
      )}
    </div>
  );
};

export default SingleMealStatus;
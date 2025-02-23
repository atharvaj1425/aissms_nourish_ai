import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SingleMealStatus = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('/api/v1/users/active-meals', {
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
      const response = await axios.put(`/api/v1/users/update-status/${mealId}`, {
        status: newStatus,
        otp: newStatus === 'Out for Delivery' ? otp : undefined,
        role: 'individual'
      });
      setMeals(meals.map(meal => meal._id === mealId ? { ...meal, status: newStatus } : meal));
      if (newStatus === 'Arrival for Pick Up') {
        alert(`OTP sent: ${response.data.otp}`);
      }
      toast.success(`Meal status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again later.');
    }
    setUpdating(false);
  };

  const handleAccept = async (mealId) => {
    try {
      const response = await axios.post(`/api/v1/users/meals/${mealId}/accept`, {}, {
        withCredentials: true,
      });
      toast.success("Meal accepted successfully!");
      setMeals(meals.map(meal => meal._id === mealId ? { ...meal, status: "Accepted" } : meal));
    } catch (err) {
      console.error("Failed to accept meal:", err);
      toast.error("Failed to accept meal. Please try again later.");
    }
  };

  const handleReject = async (mealId) => {
    try {
      const response = await axios.post(`/api/v1/users/meals/${mealId}/reject`, {}, {
        withCredentials: true,
      });
      toast.success("Meal rejected successfully!");
      setMeals(meals.filter(meal => meal._id !== mealId));
    } catch (err) {
      console.error("Failed to reject meal:", err);
      toast.error("Failed to reject meal. Please try again later.");
    }
  };

  const getRoute = async (meal) => {
    if (!meal) return;

    try {
      const donorResponse = await axios.get(`/api/v1/users/${meal.donor._id}`, {
        withCredentials: true,
      });

      const donorLocation = donorResponse.data.location;

      if (!donorLocation) {
        throw new Error("Donor location data is missing");
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${donorLocation.latitude},${donorLocation.longitude}`;
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
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Failed to get location details.");
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
                <td className="py-2 px-4 border-b">{meal.foodName}</td>
                <td className="py-2 px-4 border-b">{meal.quantity}</td>
                <td className="py-2 px-4 border-b">{new Date(meal.schedulePickUp).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{meal.pincode}</td>
                <td className="py-2 px-4 border-b">{meal.donor ? meal.donor.name : 'Unknown'}</td>
                <td className="py-2 px-4 border-b">{meal.status}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => getRoute(meal)}>
                    Get Route
                  </button>
                  {meal.status === "Pending" && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 ml-2 rounded"
                        onClick={() => handleAccept(meal._id)}
                        disabled={updating}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 ml-2 rounded"
                        onClick={() => handleReject(meal._id)}
                        disabled={updating}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {meal.status === "Accepted" && (
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 ml-2 rounded"
                      onClick={() => updateStatus(meal._id, "Arrival for Pick Up")}
                      disabled={updating}
                    >
                      Arrival for Pick Up
                    </button>
                  )}
                  {meal.status === "Arrival for Pick Up" && (
                    <>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="ml-2 px-2 py-1 border rounded"
                      />
                      <button
                        className="bg-green-500 text-white px-3 py-1 ml-2 rounded"
                        onClick={() => updateStatus(meal._id, "Out for Delivery")}
                        disabled={updating}
                      >
                        Confirm Pick Up
                      </button>
                    </>
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
      <ToastContainer />
    </div>
  );
};

export default SingleMealStatus;
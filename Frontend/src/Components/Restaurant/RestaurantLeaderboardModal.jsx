import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantLeaderboardModal = ({ onClose }) => {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/v1/restaurants/restaurant-ranking', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setLeaderboardData(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold text-green-800 mb-6">Restaurant Leaderboard</h2>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {leaderboardData?.topDonors.map((donor, index) => (
                                <div 
                                    key={donor._id}
                                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full
                                            ${index === 0 ? 'bg-yellow-400' : 
                                            index === 1 ? 'bg-gray-300' : 
                                            index === 2 ? 'bg-amber-600' : 'bg-green-200'}`}
                                        >
                                            <span className="font-bold text-white">{index + 1}</span>
                                        </div>
                                        <span className="font-semibold">{donor.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-green-600 font-bold block">
                                            {donor.totalQuantity} kg
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {donor.donationsCount} donations
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {leaderboardData?.userRank && (
                            <div className="mt-6 p-4 bg-green-100 rounded-lg border-2 border-green-300">
                                <p className="text-sm text-green-600 mb-2">Your Restaurant's Position</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500">
                                            <span className="font-bold text-white">
                                                #{leaderboardData.userRank.position}
                                            </span>
                                        </div>
                                        <span className="font-semibold">{leaderboardData.userRank.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-green-600 font-bold block">
                                            {leaderboardData.userRank.totalQuantity} kg
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {leaderboardData.userRank.donationsCount} donations
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RestaurantLeaderboardModal;
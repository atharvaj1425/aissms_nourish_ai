import { SingleMeal } from "../models/singleMeal.models.js";
import { FoodDonation } from "../models/fooddonation.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getTopIndividualDonors = asyncHandler(async (req, res) => {
    const topDonors = await SingleMeal.aggregate([
        { 
            $match: { 
                status: { $in: ["Delivered", "Accepted", "Out for Delivery"] }
            } 
        },
        {
            $addFields: {
                cleanQuantity: {
                    $toInt: {
                        $replaceAll: {
                            input: "$quantity",
                            find: " ",
                            replacement: ""
                        }
                    }
                }
            }
        },
        { 
            $group: { 
                _id: "$donor", 
                totalQuantity: { $sum: "$cleanQuantity" },
                donationsCount: { $sum: 1 }
            } 
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 3 },
        { 
            $lookup: { 
                from: "users", 
                localField: "_id", 
                foreignField: "_id", 
                as: "donor" 
            } 
        },
        { $unwind: "$donor" },
        { 
            $project: { 
                _id: 0, 
                donor: "$donor.name", 
                totalQuantity: 1,
                donationsCount: 1
            } 
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, topDonors, "Top individual donors fetched successfully")
    );
});

const getTopRestaurantDonors = asyncHandler(async (req, res) => {
    const topDonors = await FoodDonation.aggregate([
        { 
            $match: { 
                status: { $in: ["Delivered", "Accepted", "Out for Delivery"] }
            } 
        },
        {
            $addFields: {
                cleanQuantity: {
                    $toInt: {
                        $replaceAll: {
                            input: "$quantity",
                            find: " ",
                            replacement: ""
                        }
                    }
                }
            }
        },
        { 
            $group: { 
                _id: "$restaurantUser", 
                restaurantName: { $first: "$restaurantName" },
                totalQuantity: { $sum: "$cleanQuantity" },
                donationsCount: { $sum: 1 }
            } 
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 3 },
        { 
            $lookup: { 
                from: "users", 
                localField: "_id", 
                foreignField: "_id", 
                as: "restaurant" 
            } 
        },
        { $unwind: "$restaurant" },
        { 
            $project: { 
                _id: 0, 
                donor: "$restaurantName",
                totalQuantity: 1,
                donationsCount: 1
            } 
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, topDonors, "Top restaurant donors fetched successfully")
    );
});

export { getTopIndividualDonors, getTopRestaurantDonors };
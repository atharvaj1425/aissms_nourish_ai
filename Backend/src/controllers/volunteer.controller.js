import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {FoodItem } from "../models/foodItems.models.js"
import { FoodDonation } from "../models/fooddonation.models.js";
import { Volunteer } from "../models/volunteer.models.js"; 
import { User } from "../models/user.models.js"
import { generateAndSendOTP, verifyOTP } from '../utils/otp.js';
import VolunteerRedistribute from "../models/volunteerRedistribute.model.js";

export const generateAccessToken = async(userId) => {
    try{
        const user = await Volunteer.findById(userId);
        const accessToken = user.generateAccessToken();
        // const refreshToken = user.generateRefreshToken();
        // user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});
        return { accessToken };
}   catch (error) {
        throw new ApiError(500, "Failed to generate tokens");
    }
} 

// const loginVolunteer = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     if (!email) throw new ApiError(400, "Email is required");
//     if (!password) throw new ApiError(400, "Password is required");

//     const user = await Volunteer.findOne({ email });
//     if (!user) throw new ApiError(404, "User not found, Unauthorized");

//     const isPasswordValid = await user.isPasswordCorrect(password);
//     if (!isPasswordValid) throw new ApiError(401, "Invalid password");

//     const { accessToken } = await generateAccessToken(user._id);

//     const foodItems = await FoodItem.find({ user: user._id });

//     // Update status for all food items and include them in the response
//     const updatedFoodItems = await Promise.all(
//         foodItems.map(async (item) => {
//             const today = new Date();
//             const expiry = new Date(item.expiryDate);
//             const diffTime = expiry - today;
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//             let newStatus = "";
//             if (diffDays > 7) newStatus = "good";
//             else if (diffDays <= 7 && diffDays >= 0) newStatus = "expiring soon";
//             else newStatus = "expired";

//             // Update the database only if the status has changed
//             if (item.status !== newStatus) {
//                 await FoodItem.findByIdAndUpdate(
//                     item._id,
//                     { $set: { status: newStatus } },
//                     { new: true }
//                 );
//             }

//             // Always return the food item with its updated status
//             return { ...item._doc, status: newStatus };
//         })
//     );

//     const loggedInUser = await Volunteer.findById(user._id).select("-password");

//     const options = {
//         httpOnly: true,
//         secure: true,
//     };

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     loggedInUser,
//                     accessToken,
//                     updatedFoodItems, // Return all food items
//                 },
//                 "User logged in successfully"
//             )
//         );
// });

// Get all food donations

const getAllFoodDonations = asyncHandler(async (req, res) => {
    const { volunteerId } = req.query;

    if (!volunteerId) {
        throw new ApiError(400, "Volunteer ID is required");
    }

    // Check if the volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
        throw new ApiError(404, "Volunteer not found");
    }

    // Fetch all food donations with "Pending" status
    const foodDonations = await FoodDonation.find({ status: "Pending" })
        .populate("restaurantUser", "name") // Always populate restaurantUser
        // .populate("volunteer", "name email") // Populate volunteer if it's assigned
        .sort({ createdAt: -1 }); // Sort by latest

    return res.status(200).json(new ApiResponse(200, foodDonations, "Food donations fetched successfully"));
});

// Accept food donation by volunteer
const acceptFoodDonation = asyncHandler(async (req, res) => {
    const { donationId } = req.params; // Donation ID from URL
    const { volunteerId } = req.body; // Volunteer ID from request body

    if (!(donationId && volunteerId)) {
        throw new ApiError(400, "Donation ID and Volunteer ID are required");
    }

    // Check if the volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
        throw new ApiError(404, "Volunteer not found");
    }

    // Check if the volunteer already has an active donation (i.e., "Accepted" or "Out for Delivery")
    const existingDonation = await FoodDonation.findOne({
        acceptedById: volunteerId,
        status: { $in: ["Accepted", "Out for Delivery"] }, // Ongoing donations
    });

    if (existingDonation) {
        throw new ApiError(400, "You can only accept one donation at a time. Complete the current donation first.");
    }

    // Find the food donation
    const foodDonation = await FoodDonation.findById(donationId);

    if (!foodDonation) {
        throw new ApiError(404, "Food donation not found");
    }

    // Check if the donation is already accepted
    if (foodDonation.status !== "Pending") {
        throw new ApiError(400, "This food donation has already been accepted or is no longer pending.");
    }

    // Assign the volunteer and update status
    foodDonation.status = "Accepted";
    foodDonation.acceptedById = volunteerId;
    foodDonation.acceptedBy = volunteer.name;
    await foodDonation.save();

    return res.status(200).json(new ApiResponse(200, foodDonation, "Food donation accepted successfully"));
});

// Reject food donation by volunteer (optional)
const rejectFoodDonation = asyncHandler(async (req, res) => {
    const { donationId } = req.params; // Donation ID from URL

    if (!donationId) {
        throw new ApiError(400, "Donation ID is required");
    }

    // Find the food donation to ensure it exists
    const foodDonation = await FoodDonation.findById(donationId);

    if (!foodDonation) {
        throw new ApiError(404, "Food donation not found");
    }

    // Do not update the status; just confirm the donation exists
    return res.status(200).json(
        new ApiResponse(200, null, "Food donation removed from your view")
    );
});

const getDonationHistory = asyncHandler(async(req, res) => {
    const volunteerId  = req.user._id;

    if (!volunteerId) {
        throw new ApiError(400, "Volunteer ID is required");
    }

    // Check if the volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
        throw new ApiError(404, "Volunteer not found");
    }

    // Fetch all donations accepted by the volunteer
    const donationHistory = await FoodDonation.find({ acceptedById: volunteerId })
        .populate("restaurantUser", "name")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, donationHistory, "Donation history fetched successfully"));
})

const getActiveDonation = asyncHandler(async(req, res) => {
    const volunteerId  = req.user._id;

    if (!volunteerId) {
        throw new ApiError(400, "Volunteer ID is required");
    }

    // Check if the volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
        throw new ApiError(404, "Volunteer not found");
    }
    // Fetch the active donation for the volunteer
    const activeDonation = await FoodDonation.findOne({
        acceptedById: volunteerId,
        status: { $in: ["Accepted", "Out for Delivery"] },
    })
    // .populate("restaurantUser", "name");

    if (!activeDonation) {
        throw new ApiError(404, "No active donation found");
    }
    // // Fetch all donations accepted by the volunteer
    // const donationHistory = await FoodDonation.find({ acceptedById: volunteerId, })
    //     .populate("restaurantUser", "name")
    //     .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, activeDonation, "Donation history fetched successfully"));
})    


// Controller for updating the status of a donation
// const updateDonationStatus = async (req, res) => {
//     const { donationId } = req.params;
//     const { status, otp } = req.body;

//     try {
//         console.log(`Updating donation status for donationId: ${donationId}, status: ${status}`);

//         const donation = await FoodDonation.findById(donationId);
//         if (!donation) {
//             console.error('Donation not found');
//             return res.status(404).json({ message: 'Donation not found' });
//         }

//         if (status === 'Arrival for Pick Up') {
//             console.log(`Sending OTP to restaurant for donationId: ${donationId}`);
//             const otp = await generateAndSendOTP(donationId, 'volunteer');
//             return res.status(200).json({ message: 'OTP sent successfully', otp });
//         }

//         if (status === 'Out for Delivery' && otp) {
//             console.log(`Verifying OTP for donationId: ${donationId}`);
//             await verifyOTP(donationId, otp, 'volunteer');
//         }

//         donation.status = status;
//         await donation.save();

//         console.log('Donation status updated successfully');
//         res.status(200).json({ message: 'Donation status updated successfully', data: donation });
//     } catch (error){
//         console.error('Error updating donation status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// Controller for updating the status of a donation
// const updateDonationStatus = async (req, res) => {
//     const { donationId } = req.params;
//     const { status, otp } = req.body;

//     try {
//         console.log(`Updating donation status for donationId: ${donationId}, status: ${status}`);

//         const donation = await FoodDonation.findById(donationId);
//         if (!donation) {
//             console.error('Donation not found');
//             return res.status(404).json({ message: 'Donation not found' });
//         }

//         if (status === 'Arrival for Pick Up') {
//             console.log(`Sending OTP to restaurant for donationId: ${donationId}`);
//             const otp = await generateAndSendOTP(donationId, 'volunteer');
//             return res.status(200).json({ message: 'OTP sent successfully', otp });
//         }

//         if (status === 'Out for Delivery' && otp) {
//             console.log(`Verifying OTP for donationId: ${donationId}`);
//             await verifyOTP(donationId, otp, 'volunteer');
//         }

//         donation.status = status;
//         await donation.save();

//         console.log('Donation status updated successfully');
//         res.status(200).json({ message: 'Donation status updated successfully', data: donation });
//     } catch (error){
//         console.error('Error updating donation status:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };



const updateDonationStatus = asyncHandler(async (req, res) => {
  const { donationId } = req.params;
  const { status, otp, remainingQuantity } = req.body;

  const donation = await FoodDonation.findById(donationId);
  if (!donation) {
    throw new ApiError(404, "Donation not found");
  }

  if (status === 'Arrival for Pick Up') {
    const otp = await generateAndSendOTP(donationId, 'volunteer');
    return res.status(200).json({ message: 'OTP sent successfully', otp });
  }

  if (status === 'Out for Delivery' && otp) {
    await verifyOTP(donationId, otp, 'volunteer');
  }

  if (status === 'Delivered') {
    if (remainingQuantity > 0 && remainingQuantity < donation.quantity) {
      const volunteer = await Volunteer.findById(donation.acceptedById);

      const redistribute = new VolunteerRedistribute({
        foodName: donation.foodName,
        volunteerName: volunteer.name,
        remainingQuantity,
        expiryDate: donation.expiryDate,
        restaurant: donation.restaurant,
        currentLocation: volunteer.currentLocation
      });

      await redistribute.save();

      // Notify other volunteers about the remaining meal
      notifyVolunteers(redistribute);
    }

    donation.status = 'Delivered';
  } else {
    donation.status = status;
  }

  await donation.save();

  res.status(200).json({ message: 'Donation status updated successfully', data: donation });
});

// const notifyVolunteers = (redistribute) => {
//   // Logic to notify other volunteers about the remaining meal
// };

const updateDeliveryStatusWithRemainingQuantity = asyncHandler(async (req, res) => {
  const { donationId } = req.params;
  const { remainingQuantity, currentLocation } = req.body;
  console.log('Remaining Quantity:', remainingQuantity);

  try {
    const donation = await FoodDonation.findById(donationId);
    if (!donation) {
      throw new ApiError(404, "Donation not found");
    }
    console.log('Donation:', donation);

    const donationQuantity = Number(donation.quantity);
    console.log('Donation Quantity:', donationQuantity);

    if (remainingQuantity > 0 && remainingQuantity < donationQuantity) {
      console.log('Entering redistribution logic');
      const volunteer = await User.findById(donation.acceptedById);
      if (!volunteer) {
        throw new ApiError(404, "Volunteer not found");
      }
      console.log('Volunteer:', volunteer);

      const redistribute = new VolunteerRedistribute({
        foodId: donation._id,
        foodName: donation.foodName,
        volunteerName: volunteer.name,
        volunteerId: volunteer._id,
        remainingQuantity,
        expiryDate: donation.expiryDate,
        restaurant: donation.restaurantUser,
        currentLocation: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        },
        status: 'Redistributed'
      });

      await redistribute.save();
      console.log('Redistribution document created:', redistribute);

      // Add the redistribution to the donation's redistributions array
      donation.redistributions.push(redistribute._id);

      // Notify other volunteers about the remaining meal
      // notifyVolunteers(redistribute);

      // Update the status of the donation to Redistributed
      donation.status = 'Redistributed';
      console.log(`Donation status updated to Redistributed for donationId: ${donationId}`);
    } else {
      // Update the status of the donation to Delivered
      donation.status = 'Delivered';
      console.log(`Donation status updated to Delivered for donationId: ${donationId}`);
    }

    await donation.save();
    console.log('Donation saved:', donation);

    res.status(200).json({ message: 'Delivery status updated successfully', data: donation });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const getIncomingRedistributions = asyncHandler(async (req, res) => {
    const redistributions = await VolunteerRedistribute.find({ status: 'Redistributed' })
      .populate('volunteerId', 'name')
      .populate('restaurant', 'name');
  
    res.status(200).json(redistributions);
  });
  
const getRedistributionHistory = asyncHandler(async (req, res) => {
    const volunteerId = req.user._id;
  
    const history = await VolunteerRedistribute.find({ volunteerId })
      .populate('volunteerId', 'name')
      .populate('restaurant', 'name');
  
    res.status(200).json(history);
  });

  const acceptRedistribution = asyncHandler(async (req, res) => {
    const { redistributionId } = req.params;
    const { currentLocation } = req.body;
  
    try {
      const redistribution = await VolunteerRedistribute.findById(redistributionId);
      if (!redistribution) {
        throw new ApiError(404, "Redistribution not found");
      }
  
      redistribution.status = 'Redistribute Accepted';
      redistribution.currentLocation = currentLocation;
      await redistribution.save();
  
      // Update the status in the FoodDonation schema
      const foodDonation = await FoodDonation.findById(redistribution.foodId);
      if (foodDonation) {
        foodDonation.status = 'Redistribute Accepted';
        await foodDonation.save();
      }
  
      res.status(200).json({ message: 'Redistribution accepted successfully' });
    } catch (error) {
      console.error('Error accepting redistribution:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  const updateRedistributionStatusToDelivered = asyncHandler(async (req, res) => {
    const { redistributionId } = req.params;
  
    const redistribution = await VolunteerRedistribute.findById(redistributionId);
    if (!redistribution) {
      throw new ApiError(404, "Redistribution not found");
    }
  
    redistribution.status = 'Delivered';
    await redistribution.save();
  
    res.status(200).json({ message: 'Redistribution status updated to Delivered successfully' });
  });

export { getAllFoodDonations, rejectFoodDonation, acceptFoodDonation, getDonationHistory, getActiveDonation, updateDonationStatus, updateDeliveryStatusWithRemainingQuantity, getIncomingRedistributions, getRedistributionHistory, acceptRedistribution, updateRedistributionStatusToDelivered };

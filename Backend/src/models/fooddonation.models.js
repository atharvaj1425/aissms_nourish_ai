import mongoose, { Schema } from "mongoose";

const foodDonationSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
        required: true
    }, 
    expiryDate: {
        type: Date,
        required: true,
    },
    schedulePickUp: {
        type: Date,
        required: true,
    },
    restaurantPincode: {
        type: Number,
       // requiured: true
    },
    restaurantName: {
        type: String,
        //required: true,
    },
    restaurantUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    acceptedById: {
        type: String
    },
    acceptedBy: {
        type: String 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Arrival for Pick Up", "Out for Delivery", "Delivered", "Expired", "Redistributed", "Redistribute Accepted"], 
        default: "Pending" 
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    redistributions: [{ type: Schema.Types.ObjectId, ref: 'VolunteerRedistribute' }],
    review: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    },
    reviews: [
      {
        ngo: { type: Schema.Types.ObjectId, ref: "User", required: true }, // NGO user submitting the review
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
}, {
    timestamps: true
})

export const FoodDonation = mongoose.model("FoodDonation", foodDonationSchema)
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
    // volunteer: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Volunteer"
    // },
    acceptedById: {
        type: String
    },
    acceptedBy: {
        type: String 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Arrival for Pick Up", "Out for Delivery", "Delivered", "Expired"], 
        default: "Pending" 
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    }
}, {
    timestamps: true
})

export const FoodDonation = mongoose.model("FoodDonation", foodDonationSchema)
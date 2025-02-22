import twilio from "twilio";
import {ApiError} from "./ApiError.js";
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

// const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
// const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// export const sendTwilioAlert = async (to, message) => {
//     try {
//         if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
//             console.error("Twilio credentials are missing!");           
//         }
//         const response = await client.messages.create({
//             body: message,
//             from: TWILIO_PHONE_NUMBER,
//             to,
//         });
//         console.log("Twilio message sent:", response.sid);
//         return response.sid;
//     } catch (error) {
//         console.error("Twilio error:", error.message);
//         throw new ApiError("Failed to send SMS alert");
//     }
// };


import twilio from 'twilio';
import { FoodDonation } from '../models/fooddonation.models.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const generateAndSendOTP = async (donationId, phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    await FoodDonation.findByIdAndUpdate(donationId, { otp, otpExpiry });

    await client.messages.create({
        body: `Your OTP for food donation pick up is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });

    return otp;
};
import { Volunteer } from "../models/volunteer.models.js";
import { verifyVolunteerJWT } from "../middlewares/auth.middleware.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {  getAllFoodDonations, rejectFoodDonation, acceptFoodDonation, getActiveDonation, getDonationHistory, updateDonationStatus } from "../controllers/volunteer.controller.js"
import { Router } from "express";

const router = Router();

// router.route("/login").post(loginVolunteer)
router.route("/getDonations").get(verifyUserJWT, authorizeRoles("volunteer"), getAllFoodDonations)
router.post("/:donationId/accept",verifyUserJWT, authorizeRoles("volunteer"), acceptFoodDonation); // Accept a donation
router.post("/:donationId/reject",verifyUserJWT, authorizeRoles("volunteer"), rejectFoodDonation); // Reject a donation (optional)
// Reject a food donation without status change
router.route("/donation-history").get(verifyUserJWT, authorizeRoles("volunteer"), getDonationHistory);
router.route("/active-donation").get(verifyUserJWT, authorizeRoles("volunteer"), getActiveDonation);
router.put('/update-status/:donationId',verifyUserJWT, authorizeRoles("volunteer"), updateDonationStatus);



export default router;
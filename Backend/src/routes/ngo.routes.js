import { Router } from "express";

import { acceptFoodDonation, rejectFoodDonation, donationRequest, getDonationHistory, getActiveDonation, updateDonationStatus,submitReview } from "../controllers/ngo.controller.js";
import { getAllFoodDonations } from "../controllers/ngo.controller.js";
import { verifyNgoJWT } from "../middlewares/auth.middleware.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = Router();

// router.route("/login").post(loginNgoUser)

router.route("/getDonations").get(verifyUserJWT, authorizeRoles("ngo"), getAllFoodDonations)

router.route("/postDonationRequest").post(verifyUserJWT, authorizeRoles("ngo"), donationRequest)

router.post("/:donationId/accept",verifyUserJWT, authorizeRoles("ngo"), acceptFoodDonation); // Accept a donation
router.post("/:donationId/reject",verifyUserJWT, authorizeRoles("ngo"), rejectFoodDonation); // Reject a donation (optional)
// Reject a food donation without status change
router.route("/donation-history").get(verifyUserJWT, authorizeRoles("ngo"), getDonationHistory);
router.route("/active-donation").get(verifyUserJWT, authorizeRoles("ngo"), getActiveDonation);
router.put('/update-status/:donationId',verifyUserJWT, authorizeRoles("ngo"), updateDonationStatus);
router.post('/review/:donationId', verifyUserJWT, authorizeRoles("ngo"), submitReview);

export default router;
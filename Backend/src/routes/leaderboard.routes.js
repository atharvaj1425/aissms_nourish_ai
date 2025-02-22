import { Router } from "express";
import { getTopIndividualDonors, getTopRestaurantDonors } from "../controllers/leaderboard.controller.js";

const router = Router();

router.get("/top-individual-donors", getTopIndividualDonors);
router.get("/top-restaurant-donors", getTopRestaurantDonors);

export default router;
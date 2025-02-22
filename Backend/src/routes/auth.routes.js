import { Router } from "express";
const router = Router();
// Update the path to the correct location of auth.controller.js
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

router.post("/register", 
    upload.single('verificationDoc'), // Multer middleware
    registerUser
);
router.route("/login").post(loginUser)

export default router;
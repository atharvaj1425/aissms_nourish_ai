import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyUserJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Extracted Token: ", token); // Check if token is received

        if (!token) {
            console.error("Error: Token not found in request");
            throw new ApiError(401, "Unauthorized, token not found");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token: ", decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            console.error("Error: User not found in DB");
            throw new ApiError(404, "User not found");
        }

        console.log("User Authorized:", user.email, "| Role:", user.role);
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Failed:", error.message);
        throw new ApiError(401, "Unauthorized, token not valid");
    }
});

export { verifyUserJWT };

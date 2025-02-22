import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));   
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//import routes
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js"
import ngoRouter from "./routes/ngo.routes.js";
import restaurantRouter from "./routes/restaurants.routes.js"
import volunteerRouter from "./routes/volunteer.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js"; // Add this line

//routes declaration
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter);
app.use("/api/v1/ngos", ngoRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/volunteers", volunteerRouter);
app.use("/api/v1/leaderboard", leaderboardRouter); // Add this line

export { app };
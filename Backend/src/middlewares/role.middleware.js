const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(`Checking Role: ${req.user.role} | Allowed Roles: ${allowedRoles.join(", ")}`);

        if (!allowedRoles.includes(req.user.role)) {
            console.error("Access Denied: User Role Not Allowed");
            return res.status(403).json({ message: "Access Denied" });
        }

        next();
    };
};
export { authorizeRoles };

//add middleware as authorizeRoles("user, ngo, volunteer, restaurant")


// export const verifyRole = (roles) => {
//     return asyncHandler(async (req, res, next) => {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
//         if (!token) {
//             throw new ApiError(401, "Unauthorized, token not found");
//         }
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const user = await User.findById(decodedToken?._id).select("-password");
//         if (!user) {
//             throw new ApiError(404, "User not found");
//         }
//         if (!roles.includes(user.role)) {
//             throw new ApiError(403, "Forbidden, insufficient permissions");
//         }
//         req.user = user;
//         next();
//     });
// };
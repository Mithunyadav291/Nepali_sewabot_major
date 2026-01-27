// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protectRoute = async (req, res, next) => {
//   const token = req.cookies.jwt;

//   if (!token) {
//     // console.log("No token found");
//     return res.status(401).json({ message: "Not authorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized - Invalid Token" });
//     }
//     const user = await User.findOne({ clerkId: decoded.clerkId });
//     req.user = user;
//     next();
//   } catch {
//     console.log("invalid token");
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

export const protectRoute = async (req, res, next) => {
  if (!req.auth.isAuthenticated) {
    return res
      .status(401)
      .json({ message: "Unauthorized-you must be logged in." });
  }
  next();
};

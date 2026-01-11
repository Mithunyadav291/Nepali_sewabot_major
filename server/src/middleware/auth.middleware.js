export const protectRoute = async (req, res, next) => {
  if (!req.auth.isAuthenticated) {
    return res
      .status(401)
      .json({ message: "Unauthorized-you must be logged in." });
  }
  next();
};

// export const protectRoute = async (req, res, next) => {
//   console.log("Auth object:", req.auth); // See what Clerk middleware populated
//   console.log(
//     "Headers Authorization:",
//     req.headers.authorization?.slice(0, 20) + "..."
//   );

//   if (!req.auth || !req.auth.isAuthenticated) {
//     return res.status(401).json({ message: "Unauthorized", details: req.auth });
//   }
//   next();
// };

// import { getAuth } from "@clerk/express";

// export const protectRoute = (req, res, next) => {
//   const { userId, isAuthenticated } = getAuth(req); // Use getAuth instead

//   console.log("getAuth result:", { userId, isAuthenticated }); // Debug

//   if (!isAuthenticated || !userId) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized - you must be logged in." });
//   }

//   // Optional: attach for convenience
//   req.auth = { userId, isAuthenticated };
//   next();
// };
// import { getAuth } from "@clerk/express";

// export const protectRoute = (req, res, next) => {
//   const { userId } = getAuth(req);

//   if (!userId) {
//     return res.status(401).json({
//       message: "Unauthorized - you must be logged in",
//     });
//   }

//   next();
// };

// import { getAuth } from "@clerk/express";

// export const protectRoute = (req, res, next) => {
//   const { userId } = getAuth(req);

//   console.log("Auth check → userId:", userId);

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   req.userId = userId; // attach for controllers
//   next();
// };

// import { getAuth } from "@clerk/express";

// export const protectRoute = (req, res, next) => {
//   const auth = getAuth(req);

//   console.log("Auth object:", auth);

//   if (!auth.userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   req.userId = auth.userId;
//   next();
// };

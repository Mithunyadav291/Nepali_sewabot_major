// import express from "express";
// import { getCurrentUser, syncUser } from "../controllers/user.controller.js";
// import { protectRoute } from "../middleware/auth.middleware.js";
// // import { requireAuth } from "@clerk/express";

// const router = express.Router();

// //protected routes
// router.post("/sync", protectRoute, syncUser);
// router.get("/me", protectRoute, getCurrentUser);

// export default router;

import express from "express";
import {
  getCurrentUser,
  syncUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middlewaretest.js";

const router = express.Router();

router.post("/sync", syncUser);
router.get("/me", protect, getCurrentUser);
router.put("/update", protect, updateProfile);

export default router;

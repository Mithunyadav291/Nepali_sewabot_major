import express from "express";
import {
  getCurrentUser,
  syncUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sync", syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/updateProfile", protectRoute, updateProfile);

export default router;

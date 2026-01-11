import express from "express";
import {
  getCurrentUser,
  syncUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sync", syncUser);
router.get("/me", protect, getCurrentUser);
router.put("/update", protect, updateProfile);

export default router;

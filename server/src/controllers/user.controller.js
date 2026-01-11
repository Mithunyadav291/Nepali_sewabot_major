import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../middleware/generateToken.js";

export const syncUser = async (req, res) => {
  try {
    const { clerkId, email, firstname, lastname, profilePicture } = req.body;

    if (!clerkId || !email || !firstname || !lastname) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const baseUsername = email.split("@")[0];
    let username = baseUsername;

    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      // 🔐 generate token for existing user
      const token = generateToken(clerkId, res);
      console.log("user already exists");
      return res.status(200).json({
        user: existingUser,
        token,
        message: "User already exists",
      });
    }
    //create new user from clerk data
    const user = await User.create({
      clerkId,
      email,
      firstname,
      lastname,
      username,
      profilePicture,
    });
    const token = generateToken(clerkId, res);
    console.log("user created successfully");
    res.status(201).json({
      user,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) return res.status(404).json({ error: "User not found" });
  console.log("successfully fetched current user");
  res.status(201).json({ user, message: "User fetched successfully" });
});

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    const { firstname, lastname, bio, location, username } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.clerkId },
      {
        $set: {
          ...(firstname && { firstname }),
          ...(lastname && { lastname }),
          ...(bio !== undefined && { bio }),
          ...(location !== undefined && { location }),
          ...(username && { username }),
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Profile updated successfully");
    res.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(clerkMiddleware());

// Middleware
app.use(
  cors({
    origin: true, // you can replace with frontend URL in production
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Nepali-Sewabot API");
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success!!!" });
});
app.use("/api/user", userRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

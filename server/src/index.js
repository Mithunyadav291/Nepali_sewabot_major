// import express from "express";
// import cors from "cors";
// import { clerkMiddleware } from "@clerk/express";
// import dotenv from "dotenv";
// import multer from "multer";
// import axios from "axios";

// import userRoutes from "./routes/user.route.js";
// import { connectDB } from "./config/db.js";

// const app = express();

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// // app.use(express.json());
// dotenv.config();

// // app.use(clerkMiddleware());
// const clerksecret_key = "sk_test_svoSWSl357e2536LZt2JQeTGOJwWrCgfz5K8zKL7ON";
// console.log("clerkSecret Key:", clerksecret_key);
// app.use(
//   clerkMiddleware({
//     secretKey: clerksecret_key,
//   })
// );

// app.get("/", (req, res) => {
//   res.send("Welcome to Nepali-Sewabot API");
// });

// app.use("/api/user", userRoutes);

// const startServer = async () => {
//   try {
//     await connectDB();
//     //listen for local development
//     if (process.env.NODE_ENV !== "production") {
//       app.listen(process.env.PORT, () => {
//         console.log("server is running on port:", process.env.PORT);
//       });
//     }
//   } catch (error) {
//     console.log("Failed to start server:", error.message);
//     process.exit(1);
//   }
// };

// startServer();

// // app.listen(process.env.PORT, async () => {
// //   await connectDB();
// //   console.log("server is running on port:", process.env.PORT);
// // });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Nepali-Sewabot API");
});

app.use("/api/user", userRoutes);

const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== "production") {
      app.listen(process.env.PORT, () => {
        console.log("server is running on port:", process.env.PORT);
      });
    }
  } catch (error) {
    console.log("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

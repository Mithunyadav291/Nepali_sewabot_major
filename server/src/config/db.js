import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB successfully.");
  } catch (error) {
    console.log("Error connecting to MONGODB");
    process.exit(1);
  }
};

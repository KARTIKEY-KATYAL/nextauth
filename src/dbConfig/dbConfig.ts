import mongoose from "mongoose";

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const connection = mongoose.connection;
    connection.on("connected", () => {
        console.log("MongoDB connected");
    });
    connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1); 
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
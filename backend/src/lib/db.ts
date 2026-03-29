import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected")
    } catch (error) {
        console.error("Error while connecting to MongoDB:\n", error);
        process.exit(1);        // 1 means fail, 0 means success
    }
}
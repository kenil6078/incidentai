import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectToDB() {
    try {
        await mongoose.connect(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            tls: true,
        });


        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        throw error; 
    }
}

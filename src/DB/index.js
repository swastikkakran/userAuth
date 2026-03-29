import mongoose from "mongoose";

const connectDB = async function () {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connection established!")
        
    } catch (error) {
        console.error("couldn't connect to DB...")
        console.error(error)
    }
}

export { connectDB }
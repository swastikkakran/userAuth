import mongoose from "mongoose";

const connectDB = async function() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connection established...")
    } catch (error) {
        console.error("Couldn't connect to mongoDB.")
        process.exit(1)
    }
}

export default connectDB
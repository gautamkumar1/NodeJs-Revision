import mongoose from "mongoose";

// Connect to MongoDB

const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}



export default connectDb;
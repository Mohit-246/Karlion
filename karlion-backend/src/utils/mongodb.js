import mongoose from "mongoose";

const connectDB = async ()=> {

    try {
        const connection = mongoose.connect(process.env.MONGO_DB_URI)
        console.log("DB is connected");
        
    } catch (error) {
        console.error(`Error ${error.message}`);
        process.exit(0);
    }
}

export default connectDB;
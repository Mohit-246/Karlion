const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${URI}/karlion`);
    console.log("DB is connected");
  } catch (error) {
    console.error(`Error ${error.message}`);
    process.exit(0);
  }
};

module.exports = connectDB;
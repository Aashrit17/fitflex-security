const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB URI:", process.env.MONGO_URI); // for debug

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `✅ MongoDB connected to: ${conn.connection.host}`.white.underline.bold
    );
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;

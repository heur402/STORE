import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop the old unique index on slug if it exists
    try {
      await mongoose.connection.db.collection("products").dropIndex("slug_1");
      console.log("Dropped old slug unique index");
    } catch (e) {
      // Index might not exist, that's fine
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
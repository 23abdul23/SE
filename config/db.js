import mongoose from "mongoose";

const connectDB = async () => {
  try {
    //const conn = await mongoose.connect("mongodb+srv://odooAdmin:88691315@cluster0.mfv2pgl.mongodb.net/Aegis?retryWrites=true&w=majority", {
    const conn = await mongoose.connect(process.env.MONGODB_URI_C || "mongodb://localhost:27017/aegis-id", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

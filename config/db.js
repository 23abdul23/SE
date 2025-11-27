const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
  try {

    const development = process.env.DATABASE
    //const conn = await mongoose.connect("mongodb+srv://odooAdmin:88691315@cluster0.mfv2pgl.mongodb.net/Aegis?retryWrites=true&w=majority", {
    let conn;

    if (development == 'CLOUD'){
      conn = await mongoose.connect(process.env.MONGODB_URI_C, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }
    else {
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }


    console.log(`📦 MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

module.exports = connectDB

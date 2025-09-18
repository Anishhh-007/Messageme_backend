const mongoose = require("mongoose")
const config = require("config")
const connectDB = () =>{
   return  mongoose.connect(config.get("MONGODB_URI"))

}

module.exports = connectDB
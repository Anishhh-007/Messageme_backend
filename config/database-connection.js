const mongoose = require("mongoose")
const config = require("config")
const connectDB = () =>{
    return mongoose.connect(`${config.get("MONGODB_URI")}/messageMe`)
}

module.exports = connectDB
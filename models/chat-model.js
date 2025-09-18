
const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    } , 
    text:{
        type:String,
        required:true
    }
})

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    message: [messageSchema]
})

module.exports = mongoose.model("chat", chatSchema)
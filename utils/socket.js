
const socket = require("socket.io")
const chatModel = require("../models/chat-model")
const initialiseSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userID, targetID }) => {
            const room = [userID, targetID].sort().join('_')
            console.log("Joining room lets go : " + room);

            socket.join(room)
        })

        socket.on("sendMessage",async ({ user, targetID, text }) => {
            const room = [user, targetID].sort().join('_')            
            io.to(room).emit("Message_Received" , {user , targetID , text})

            try {
                let chat =await chatModel.findOne({
                participants : {$all :[user , targetID]}
            })
            if(!chat) {
                chat = new chatModel({
                    participants: [user , targetID] ,
                    message:[]
                })
            }

            chat.message.push({
                senderID : user,
                text
            })

            await chat.save()
            } catch (error) {
                console.log("Chat database save error : " + error);
                
            }
        })

        socket.on("disconnect", () => {

        })
    })
}

module.exports = initialiseSocket 
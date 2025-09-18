const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const chatModel = require("../models/chat-model");
const router = express.Router();

router.get("/:senderID/:receiverID", userAuth, async (req, res) => {

    try {
        const { senderID, receiverID } = req.params

        let findChats = await chatModel.findOne({
            participants: { $all: [senderID, receiverID] }
        });
        if (!findChats) {
            findChats = new chatModel({
                participants: { $or: [senderID, receiverID] },
                message: []

            })
        }

        await findChats.save()
        res.status(200).send(findChats)

    } catch (error) {
        res.status(300).send(error)
    }

})

module.exports = router


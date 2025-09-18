const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const connectionModel = require("../models/connection-model");
const userModel = require("../models/user-model");
const router = express.Router();


router.get('/user/:id', userAuth, async (req, res) => {
  try {
    const { id } = req.params
    const findID = await userModel.findById(id)

    if (!findID) return res.status(300).send("The user does not exist")

    const user = req.user

    // 🔑 check both directions
    const findConnection = await connectionModel.findOne({
      $or: [
        { from: user._id, to: id },
        { from: id, to: user._id }
      ]
    })

    if (findConnection) {
      return res.status(300).send("Request already exists (pending/accepted/rejected)")
    }

    const makeConnection = await connectionModel.create({
      from: user._id,
      to: id,
      status: "sent"
    })

    res.status(200).send(makeConnection)

  } catch (error) {
    res.status(500).send("connection error: " + error.message)
  }
})

router.get('/request', userAuth, async (req, res) => {
    try {
        const user = req.user

        const findRequest = await connectionModel.find({
            to: user._id,
            status: "sent"
        }).populate("from", 'firstName lastName image _id')
        if (findRequest.length === 0) {
            return res.status(200).send([]); // just return empty array
        } else {
            return res.status(200).send(findRequest);
        }


    } catch (error) {
        res.send("Request error : " + error.message)
    }
})

router.post('/:status/:id', userAuth, async (req, res) => {
    try {
        const { status, id } = req.params;
    const findFirst = await connectionModel.findOne({
        from: id, to: req.user._id, status: status
    })

    if (findFirst) return res.status(300).send("Cannot make same request twice")

    await connectionModel.findOneAndUpdate(
        { from: id, to: req.user._id, status: "sent" },
        { $set: { status: status } },
        { new: true }
    )

    res.status(200).send("User added")
    } catch (error) {
        res.status(300).semd(error.message)
    }

})

router.get("/friends" , userAuth, async (req , res) =>{
    try {
        const findFrends = await connectionModel.find({
            
           $or :[
            { to : req.user._id },
            {from: req.user._id}
           ],
            status : "accept"
        }).populate("from" , "firstName lastName image _id").populate("to" , "firstName lastName image _id" )
        

        res.status(200).send(findFrends)
    } catch (error) {
        res.status(300).send(error.message)
    }
})

module.exports = router
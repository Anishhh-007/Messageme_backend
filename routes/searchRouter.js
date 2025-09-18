const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const userModel = require("../models/user-model");
const router = express.Router();

router.post('/user', userAuth, async (req, res) => {
    try {
        const { name } = req.body; // get the input string

        if (!name) return res.status(400).send("Name is required");

        if (name.includes(" ")) {
            // user typed first and last name
            const [firstName, lastName] = name.split(" ");

            const findAll = await userModel.find({
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase()
            });

            if (!findAll.length) return res.status(404).send("No user found with such names");

            res.status(200)
            res.send(findAll);
          
            

        } else {
            // user typed only one word (could be firstName or lastName)
            const findAll = await userModel.find({
                $nor: [
                    { firstName: req.user.firstName, lastName: req.user.lastName }
                ],
                $or: [
                    { firstName: name.toLowerCase() },
                    { lastName: name.toLowerCase() }
                ]
            });

            if (!findAll.length) return res.status(404).send("No user found with such name");

            res.send(findAll);
        }
    } catch (error) {
        res.status(500).send("Search error: " + error.message);
    }
});

module.exports = router;

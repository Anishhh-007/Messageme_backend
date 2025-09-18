const express = require("express")
const router = express.Router();
const userModel = require("../models/user-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cp = require("cookie-parser");
const config = require("config");
const upload = require("../config/multer-config");
const { userAuth } = require("../middlewares/userAuth");
const sharp = require('sharp')

router.get("/", (req, res) => {
   res.send("HEllo world")
})


router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;

    if (!firstName || !lastName || !email || !password || !gender) {
      return res.send("Credentials must be filled");
    }

    const checkUser = await userModel.findOne({ email });
    if (checkUser) return res.send("User with same credentials exists");

    const hash = await bcrypt.hash(password, 10);

    let base64Image = null;
    if (req.file) {
      // convert everything to PNG format & then base64 string
      const pngBuffer = await sharp(req.file.buffer).png().toBuffer();
      base64Image = pngBuffer.toString("base64");
    }

    const createUser = await userModel.create({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      email,
      password: hash,
      gender,
      image: base64Image, // always stored as base64 string
    });

    const token = jwt.sign({ data: createUser._id }, config.get("SECRET_KEY"));
    res
      .cookie("token", token)
      .json({ message: "User Created Successfully", data: createUser });
  } catch (error) {
    res.send(error.message);
  }
});


router.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body

      if (!email && !password) return res.send("Credentials must be filled")


      const findUser = await userModel.findOne({
         email
      })

      if (!findUser) return res.status(404).send("User not found")

      const hash = await bcrypt.compare(password, findUser.password)




      if (hash === false) return res.status(404).send("User not found")


      const token = jwt.sign({ data: findUser._id }, config.get("SECRET_KEY"))

      res.cookie("token", token)
         .json({ message: "User Logged In Successfully", data: findUser })

   } catch (error) {
      res.send(error.message);

   }


})

router.get("/profile", userAuth, async (req, res) => {
   try {
      const user = req.user
      res.json(user)
   } catch (error) {
      res.send('Profile error : ' + error.message)
   }
})

router.get("/logout" ,userAuth , (req , res) =>{
try {
   res.cookie("token" , "" , {expires: new Date(0)} )  .send("Logged out successfully")
} catch (error) {
   res.send("Logout error: " +error.message)
}
})


module.exports = router


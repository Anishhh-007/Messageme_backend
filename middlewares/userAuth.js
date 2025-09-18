const jwt = require("jsonwebtoken")
const config = require("config")
const userModel = require("../models/user-model")

const userAuth = async(req , res , next) =>{
    try {
         
        const token = req.cookies.token
       
        if(!token) return res.send("Login first")
        
           const verifyUser = jwt.verify(token , config.get("SECRET_KEY")) 
           const findUser = await userModel.findOne({
            _id : verifyUser.data
           })
           req.user = findUser
           next()

    } catch (error) {
        res.send("Middlewear error :" + error.message)
    }
}
module.exports = {
    userAuth
}

const mongoose = require ("mongoose")


const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3
        
    },
     lastName : {
        type : String,
        required : true,
        
    }, gender : {
        type : String,
        enum : {
            values : ["male" , "female"],
            message : `$VALUE is not a valid gender`
        }
        
    }, email : {
        type : String,
        required : true,
        
    }, password :{
        type : String,
        required : true,
    },
    image:{
        type:String
    }
})

module.exports = mongoose.model("user" , userSchema)
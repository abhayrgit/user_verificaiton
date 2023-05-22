const mongoose = require('mongoose')


const User = new mongoose.Schema({
    full_name:{
        type:String,
    },
    email:{
        type:String
    },
    mobile:{
        type:Number
    },
    password:{
        type:String
    },
    verified:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

module.exports = mongoose.model('User', User)
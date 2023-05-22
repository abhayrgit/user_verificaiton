const mongoose = require('mongoose')
const { Schema } = mongoose;

const OTPVerify = new mongoose.Schema({
    userId:{ type: Schema.Types.ObjectId, ref: 'User' },
    otp: {
        type: Number
    },
    createdAt: { type: Date, expires: 300, default: Date.now  }
})


module.exports = mongoose.model('OTPVerify', OTPVerify)
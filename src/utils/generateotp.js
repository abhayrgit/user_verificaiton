

//Function to generate OTP
module.exports.generateOTP = function(){
    let OTP = Math.floor(1000 + Math.random() * 9000);
    return OTP
}
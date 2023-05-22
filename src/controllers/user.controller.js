const User = require('../models/user')
const nodemailer = require("nodemailer");
const OTPVerify = require('../models/otpverify')
let CryptoJS = require("crypto-js");
const PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET_KEY
let jwt = require('jsonwebtoken');
const {generateOTP} = require('../utils/generateotp')


//Function to create User
const userRegister = async (req, res) => {
    try {
        const { full_name, email, mobile, password } = req.body
        // Encrypt Password
        var hashedpassword = CryptoJS.AES.encrypt(password, PASSWORD_SECRET_KEY).toString();
        const newuser = await User.create({
            full_name,
            email,
            mobile,
            password: hashedpassword
        })
        if (!newuser) {
            return res.status(400).json({
                message: "User Creation Error"
            })
        }
        const OTP = await generateOTP()
        const otpverify = await OTPVerify.create({
            userId: newuser._id,
            otp: OTP
        })
        if (!otpverify) {
            return res.status(400).json({
                message: "OTP Creation Error"
            })
        }
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            // port: 465,
            // secure: true, // true for 465, false for other ports
            service: 'gmail',
            auth: {
                user: "tm074104@gmail.com", // generated ethereal user
                pass: "pnwngkjcaivuwsur", // generated ethereal password
            },
        });
        let mailinfo = {
            from: 'tm074104@gmail.com', // sender address
            to: "abhay69rana@gmail.com", // list of receivers
            subject: "OTP Verification mail", // Subject line
            // text: "Hello world?", // plain text body
            html: `<b>You have registered. To verify your account use OTP ${OTP}</b>`, // html body
        };
        transporter.sendMail(mailinfo, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Email Send");
            }
        })
        return res.status(201).json({
            message: "User Created",
            result: newuser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

//Fucntion to regenerate OTP
const regenerateOTP = async(req,res)=>{
    try {
        const {email} = req.body
        const userdetail = await User.findOne({email:email})
        const OTP = await generateOTP()
        const otpverify = await OTPVerify.create({
            userId: userdetail._id,
            otp: OTP
        })
        if (!otpverify) {
            return res.status(400).json({
                message: "OTP Creation Error"
            })
        }
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            // port: 465,
            // secure: true, // true for 465, false for other ports
            service: 'gmail',
            auth: {
                user: "tm074104@gmail.com", // generated ethereal user
                pass: "pnwngkjcaivuwsur", // generated ethereal password
            },
        });
        let mailinfo = {
            from: 'tm074104@gmail.com', // sender address
            to: "abhay69rana@gmail.com", // list of receivers
            subject: "OTP Verification mail", // Subject line
            // text: "Hello world?", // plain text body
            html: `<b>OTP is generated. To verify your account use OTP ${OTP}. It will expire in 5 minutes</b>`, // html body
        };
        transporter.sendMail(mailinfo, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Email Send");
            }
        })
        return res.status(201).json({
            message: "OTP generated"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


//Function to Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        const userdetail = await User.findOne({ email: email })
        if (!userdetail) {
            return res.status(400).json({
                message: "Not a registered user"
            })
        }
        // if (userdetail.verified == true) {
        //     return res.status(400).json({
        //         message: "You are already verified"
        //     })
        // }
        const otpdetail = await OTPVerify.findOne({ userId: userdetail._id })
        if(!otpdetail){
            return res.status(400).json({
                message: "OTP expired"
            })
        }
        const currentTime = new Date()
        const otpExpirationTime = otpdetail.createdAt.getTime() + 5 * 60 * 1000;
        if (currentTime.getTime() > otpExpirationTime) {
            return res.status(400).json({
                message: "OTP expired"
            })
        }
        // console.log(otpdetail);
        // if(){
        //     console.log(true)
        // }
        if (otpdetail.otp !== otp) {
            return res.status(400).json({
                message: "Wrong OTP"
            })
        }
        await User.findByIdAndUpdate(userdetail._id, { verified: true })
        return res.status(201).json({
            message: "OTP verified"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


//Function for User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userdetail = await User.findOne({ email: email }).lean()
        if (!userdetail) {
            return res.status(400).json({
                message: "Not a registered User"
            })
        }
        if (userdetail.verified == false) {
            return res.status(400).json({
                message: "Not a verified user"
            })
        }
        // Decrypt
        let bytes = CryptoJS.AES.decrypt(userdetail.password, process.env.PASSWORD_SECRET_KEY);
        let originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== password) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            })
        }
        //Create JWT token
        const token = jwt.sign({ userdetail: userdetail }, process.env.JWT_SECRET_KEY, { expiresIn: '1min' })
        userdetail['token'] = token
        return res.status(200).json({
            message: "LoggedIn Successfully",
            result: userdetail
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


//Function to Get User Data
const userByID = async (req, res) => {
    try {
        const userdetail = await User.findById(req.userdata._id)
        if (!userdetail) {
            return res.status(404).json({
                message: "User not Found"
            })
        }
        return res.status(200).json({
            message: "User Found",
            result: userdetail
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


module.exports = {
    userRegister,
    verifyOTP,
    regenerateOTP,
    login,
    userByID
}
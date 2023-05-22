const User = require('../models/user')
const jwt = require('jsonwebtoken')

//Function to verify token
const auth = async (req, res, next) => {
    try {
        const authtoken = req.header('token')
        // console.log(authtoken);
        if (!authtoken) {
            return res.status(400).json({
                message: "Token not provided"
            })
        }
        await jwt.verify(authtoken, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) {
                // console.log(err)
                return res.status(401).json({
                    message: err
                })
            }
            req.userdata = data.userdetail
            next()
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = auth
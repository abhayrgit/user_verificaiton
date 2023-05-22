const mongoose = require('mongoose')


const connectDB = async(DATABASE_URL)=>{
    try {
        const dbOptions = {
            dbname: "Capegemini"
        }
        await mongoose.connect(DATABASE_URL, dbOptions)
        console.log("Database connected succesfully")
    } catch (error) {
        console.log("Error in Database connection",error)
    }
}

module.exports = connectDB
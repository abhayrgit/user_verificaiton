require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const connectDB = require('./config/db.config')
const DATABASE_URL = process.env.DATABASE_URL
const routes = require('./src/routes/main.routes')

//middleware
app.use(express.json())
app.use('/', routes)

//Database URL passes
connectDB(DATABASE_URL)



// app.get('/', (req,res)=>{
//     try {
//         res.status(200).json({
//             message: "Api called"
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: "Internal Server Error"
//         })
//     }
// })

app.listen(PORT, (err)=>{
    if(err){
        console.log(err)
    }else{
        console.log(`Server is running at http://localhost:${PORT}`);
    }
})
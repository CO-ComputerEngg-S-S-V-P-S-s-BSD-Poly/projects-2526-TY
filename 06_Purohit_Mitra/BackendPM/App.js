require("dotenv").config();
const express = require("express")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const app = express()

app.use(express.json())


const mongoose = require("mongoose")

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("MongoDB Connected ✅"))
//     .catch((err) => console.log(err));/

mongoose.connect("mongodb://localhost:27017/User")
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.error(err))

app.use('/',express.static('Images'))    

app.get('/', (req, res) => {
    res.send('localhost 8000')
})

const cors = require('cors')
app.use(cors())

app.use('/Images', express.static('Images'));


const panditRoutes = require('./routes/panditRoutes')
app.use('/api/pandit',panditRoutes)

const UserRoutes = require('./routes/UserRoutes')
app.use('/api/user',UserRoutes)

const BookingRoutes = require('./routes/BookingRoutes')
app.use('/api/booking',BookingRoutes)

const reviewRoutes = require("./routes/reviewRoutes")
app.use("/api/review",reviewRoutes)


app.listen(8000, () => {
    console.log("running on localhost 8000")
})
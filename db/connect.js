const mongoose = require("mongoose")

const connectDB = (url) => {
    console.log('Database connection established!')
    return mongoose.connect(url)
}

module.exports = connectDB
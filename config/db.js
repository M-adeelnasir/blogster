const mongoose = require('mongoose');
const keys = require('./keys');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(keys.mongoURI)
        console.log("Mongo Db connection establised")
    } catch (err) {
        console.log("MONGO ERROR==>", err)
    }
}

module.exports = connectDB
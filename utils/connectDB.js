const mongoose = require('mongoose') // connecting and testing  DB

function connectDB(){
    try {
        console.log('connecting to db')
        mongoose.connect('mongodb://127.0.0.1:27017/sammy') // sammy is the name of the database
        console.log('connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB




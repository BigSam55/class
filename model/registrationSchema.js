const mongoose = require("mongoose");
const {Schema} = mongoose;
// To connect to database, 

// const users = new Schema({
//     username: String,
//     password: String, 
//     role: String,
//     active: Boolean
// }) // without validation

// Backend Schema Validat
const users = new Schema({
        username:{
        type:  String,
        require: true, 
        minLength:[10,'Username must be above 10'],
        unique:true
        },

        password:{
        type:  String,
        require: true, 
        minLength:[7,'Password must be above 7'],
        },

        role:{
        type:  String,
        require: true, 
        },

        active:{
        type:  Boolean,
        require: true, 
        },
        phone:{
            type: Number,
            require: true,
        },
        passport:{
            type: String,
            require: true,
        },
        fullname:{
            type: String,
            require: true,
        },

    })

module.exports = mongoose.model('User', users);


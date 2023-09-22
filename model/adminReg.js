const mongoose = require("mongoose");
const {Schema} = mongoose;

const Admin = new Schema({
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

})

module.exports = mongoose.model('Admins', Admin);


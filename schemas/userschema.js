const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id:String, // id = email address
    firstName:String,
    lastName:String,
    birthday:Date,
    maritalStatus:String
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
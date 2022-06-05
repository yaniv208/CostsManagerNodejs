const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    id:String, // id = email address
    month:Number,
    year:Number,
    totalSum:Number
});

const Report = mongoose.model('reports', reportSchema);

module.exports = Report;
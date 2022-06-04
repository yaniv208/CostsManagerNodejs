const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    id:String,
    month:Number,
    year:Number,
    totalSum:Number
});

const reportModel = mongoose.model('reports', reportSchema);

module.exports = reportModel;
const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    id:String,
    description:String,
    sum:Number,
    date:Date,
    category:String
});

const Cost = new mongoose.model('costs', costSchema);

module.exports = Cost;
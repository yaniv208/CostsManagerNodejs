var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

const userSchema = new mongoose.Schema({
  id:String,
  firstName:String,
  lastName:String,
  birthday:Date,
  maritalStatus:String
});

// 'users' is the name of the collection inside the database
const userModel = mongoose.model('users', userSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// http://localhost..../users/add
{
}
module.exports = router;
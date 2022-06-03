const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const userSchema = new mongoose.Schema({
  id:String, // id = email address
  firstName:String,
  lastName:String,
  birthday:Date,
  maritalStatus:String
});

// 'users' is the name of the collection inside the database
const userModel = mongoose.model('users', userSchema);

router.get('/', async function(req, res, next) {
  // Fetch all users from DB.
  let users = await userModel.find({});

  if(users.length === 0){
    res.status(200).send("There aren't any saved users")
  }
  else{
    res.status(200).send(users);
  }
});

router.post('/add', function(req, res, next) {
  let user;

  // Cannot use upper case letters in request parameters, so query name uses lower case only.
  user = new userModel({id:req.query.id, firstName:req.query.firstname, lastName:req.query.lastname,
    birthday:req.query.birthday, martialStatus:req.query.martialstatus});

  // Saving the new user into DB.
  user.save().then(user => res.status(200).json(user) + '\n\nUser saved successfully!')
      .catch(error => res.status(400).send('There was a problem saving the user. \n' + error));

});

router.delete('/delete', async function(req, res, next) {
  userModel.deleteMany({})
      .then(users => res.status(200).send('All of the users were successfully deleted.'))
      .catch(error => res.status(400).send('There was a problem deleting users. \n' + error))
});

module.exports = router;
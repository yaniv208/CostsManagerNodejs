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

/**
 * Fetch all users from DB, if none exists, get a corresponding message.
 */
router.get('/getall', async function(req, res, next) {
  let users;
  users = await userModel.find({});

  if(users.length === 0){ // if users don't exist in the collection
    res.status(200).send('There aren\'t any saved users');
  }
  else{
    res.status(200).send(users);
  }
});

/**
 * Add a new user into the 'users' collection into the database.
 * Return a corresponding message if any error occurs.
 */
router.post('/add', function(req, res, next) {
  let user;

  // Cannot use upper case letters in request parameters, so query name uses lower case only.
  user = new userModel({id:req.query.id, firstName:req.query.firstname, lastName:req.query.lastname,
    birthday:req.query.birthday, martialStatus:req.query.martialstatus});

  // Saving the new user into DB.
  user.save().then(user => res.status(201).json(user) + '\n\nUser saved successfully!')
      .catch(error => res.status(400).send('There was a problem saving the user. \n' + error));

});

/**
 * Delete all the users that exist in the 'users' collection.
 */
/*
router.delete('/deleteall', async function(req, res, next) {
  userModel.deleteMany({})
      .then(users => res.status(200).send('All of the users were successfully deleted.'))
      .catch(error => res.status(400).send('There was a problem deleting users. \n' + error));
});
*/

/**
 * Delete a specific user from the database, according to their individual ID.
 */
/*
router.delete('/delete/:userId', async function(req, res, next) {
  let idToBeDeleted;
  idToBeDeleted = req.params.userId;

  userModel.deleteOne({id:idToBeDeleted}).then(user => res.status(200)
      .send('User deleted successfully.'))
      .catch(error => res.status(400).send('There was a problem deleting the user. \n' + error));
});
*/
// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
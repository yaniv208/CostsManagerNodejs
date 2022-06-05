const express = require('express');
const User = require("../schemas/userschema");
const router = express.Router();

/**
 * Fetch all users from DB, if none exists, get a corresponding message.
 */
router.get('/getall', async function(req, res) {
  let users;
  users = await User.find({});

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
router.post('/add', async function(req, res) {
  let user;

  user = new User({id:req.query.id, firstName:req.query.firstName, lastName:req.query.lastName,
    birthday:req.query.birthday, maritalStatus:req.query.maritalStatus});

  // Saving the new user into DB.
  await user.save().then(user => res.status(201).json(user) + '\n\nUser saved successfully!')
      .catch(error => res.status(400).send('There was a problem saving the user. \n' + error));
});

/**
 * Delete all the users that exist in the 'users' collection.
 */
router.delete('/deleteall', async function(req, res) {
  await User.deleteMany({})
      .then(() => res.status(200).send('All of the users were successfully deleted.'))
      .catch(error => res.status(400).send('There was a problem deleting users. \n' + error));
});

/**
 * Delete a specific user from the database, according to their individual ID.
 */
router.delete('/delete/:userId', async function(req, res) {
  const idToBeDeleted = req.params.userId;

  await User.deleteOne({id:idToBeDeleted}).then(() => res.status(200)
      .send('User deleted successfully.'))
      .catch(error => res.status(400).send('There was a problem deleting the user. \n' + error));
});

// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
const express = require('express');
const User = require('../schemas/userschema');
const router = express.Router();

/**
 * Fetch all users from DB, if none exists, get a corresponding message.
 */
router.get('/getall', async function(req, res) {
  let users;
  users = await User.find({});

  if(users.length === 0){ // if users don't exist in the collection
    res.status(404).send('There aren\'t any saved users in the database.');
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

  const birthdayDate = new Date(req.body.birthday);
  const emailAddress = req.body.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  // Validating user's email address, birthday date and name
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
  const namePattern = /^[a-zA-Z ]+$/;

  let isDateValid = true;
  const isEmailValid = emailPattern.test(emailAddress);
  const isFirstNameValid = namePattern.test(firstName);
  const isLastNameValid = namePattern.test(lastName);

  // User is older than 10 years old
  const currentYear = new Date().getFullYear();
  if(isNaN(birthdayDate) || birthdayDate.getFullYear() > currentYear - 10){
    isDateValid = false;
  }

  if(isDateValid && isEmailValid && isFirstNameValid && isLastNameValid){
    user = new User({id:emailAddress, firstName:firstName, lastName:lastName,
      birthday:birthdayDate, maritalStatus:req.body.maritalStatus});

    // Saving the new user into DB.
    await user.save().then(user => res.status(201).json(user + '\n\nUser saved successfully!'))
        .catch(error => res.status(400).send('There was a problem saving the user. \n' + error));
  } else{
    res.status(400).send('Invalid birthday date / e-mail address / name input. Please try again.');
  }

});

// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
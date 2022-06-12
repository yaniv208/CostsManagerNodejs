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

  // Validating new user's birthday date
  const birthdayToValidate = new Date(req.query.birthday);
  const currentYear = new Date().getFullYear();

  const isDayValid = (0 <= birthdayToValidate.getDay() && birthdayToValidate.getDay() <= 30);
  const isMonthValid = (0 <= birthdayToValidate.getMonth() && birthdayToValidate.getMonth() <= 11);
  const isYearValid = (1900 <= birthdayToValidate.getFullYear() && birthdayToValidate.getFullYear() <= currentYear);

  // Validating new user's email address
  const emailAddress = req.query.id;
  const patternToCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;

  const isEmailValid = patternToCheck.test(emailAddress);

  if(isDayValid && isMonthValid && isYearValid && isEmailValid){
    user = new User({id:emailAddress, firstName:req.query.firstName, lastName:req.query.lastName,
      birthday:birthdayToValidate, maritalStatus:req.query.maritalStatus});

    // Saving the new user into DB.
    await user.save().then(user => res.status(201).json(user + '\n\nUser saved successfully!'))
        .catch(error => res.status(400).send('There was a problem saving the user. \n' + error));
  } else{
    res.status(400).send('Invalid Date/E-Mail address input. Please try again.');
  }

});

// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
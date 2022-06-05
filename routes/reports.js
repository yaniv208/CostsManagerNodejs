const express = require('express');
const Report = require('../schemas/reportschema');
const router = express.Router();

/**
 * Get a detailed report about a specific month and year, per specific user.
 */
router.get('/get', async function(req, res) {
    // Params of wanted report to fetch
    const idToCheck = req.query.id;
    const monthToCheck = req.query.month;
    const yearToCheck = req.query.year;

    const monthlyReport = await Report.find({id:idToCheck, month:monthToCheck, year:yearToCheck})
        .catch(error => res.status(400)
            .send('There was a problem retrieving the report. \n' + error));

    // Report exists in DB and was fetched successfully
    if(monthlyReport.length === 1){
        res.status(200)
            .send(`Total sum at ${monthToCheck}/${yearToCheck} is ${monthlyReport[0].totalSum}`
            + ` for user ${idToCheck}.`);
    }
    // A report doesn't exist in the collection, create one, save it on the db and show the sum to the user.
    else{
        res.status(200)
            .send(`No report for ${monthToCheck}/${yearToCheck} was found.`);
    }
});

module.exports = router;
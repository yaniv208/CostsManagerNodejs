const express = require('express');
const Report = require('../schemas/reportschema');
const router = express.Router();

/**
 * Get a detailed report about a specific month and year, per specific user.
 */
router.get('/get', async function(req, res) {
    // Params of wanted report to fetch
    const userId = req.query.id;
    const monthOfReport = req.query.month;
    const yearOfReport = req.query.year;
    const currentYear = new Date().getFullYear();

    const isMonthValid = (monthOfReport >= 1 && monthOfReport <= 12);
    const isYearValid = (yearOfReport >= 1900 && yearOfReport <= currentYear);

    if(!(isMonthValid && isYearValid)){ // Invalid date input
        res.status(400).send('Invalid date input, please try again.');
    } else{
        const monthlyReport = await Report.find({id:userId, month:monthOfReport, year:yearOfReport})
            .catch(error => res.status(400)
                .send('There was a problem retrieving the report. \n' + error));

        // Report exists in DB and was fetched successfully
        if(monthlyReport.length === 1){
            const listOfCosts = monthlyReport[0].listOfCosts;
            console.log(`${listOfCosts} \n\n`
                +`Total sum at ${monthOfReport}/${yearOfReport} is ${monthlyReport[0].totalSum}`
                + ` for user ${userId}.`);
            res.status(200).send(monthlyReport);
        }
        // A report doesn't exist in the collection, create one, save it on the db and show the sum to the user.
        else{
            res.status(404)
                .send(`No report for ${monthOfReport}/${yearOfReport} was found for user ${userId}.`);
        }
    }
});

module.exports = router;
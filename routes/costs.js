const express = require('express');
const Cost = require('../schemas/costschema');
const Report = require('../schemas/reportschema');
const User = require('../schemas/userschema');
const router = express.Router();

/**
 * Add a new cost into the 'costs' collection into the database.
 * Return a corresponding message if any error occurs.
 */
router.post('/add', async function(req, res) {
    const userId = req.body.id;
    const costSum = req.body.sum;

    const costDate = new Date(req.body.date);
    const costYear = costDate.getFullYear();
    const costMonth = costDate.getMonth() + 1;

    const user = await User.find({id:userId});

    let isSumValid = true;
    let isUserValid = true;
    let isDateValid = true;
    let message = '';   // Message to user in case there was any problem with the inputs

    // Check if the sum is positive number
    if(costSum <= 0){
        isSumValid = false;
        message = 'Cost sum must be greater than 0.';
    }

    // Check if the user already exists in the users collection
    if(user.length < 1){
        isUserValid = false;
        message = 'The user does not exist in the database.';
    }

    if(isNaN(costDate)){ // If the inputted date is not valid
        isDateValid = false;
        message = 'Invalid date input.';
    }

    if(isSumValid && isUserValid && isDateValid){
        const cost = new Cost({id:userId, description:req.body.description,
            sum:costSum, date:costDate, category:req.body.category});

        // Check if there's an existing report of this specific month and year
        const report = await Report.find({id:userId, month:costMonth, year:costYear});

        // Creating a template for a cost to be included in a future report
        let costConcatenation = `\n${req.body.description} --- Category: ${req.body.category}, `
            + `Sum: ${costSum}`;

        if(report.length === 1){ // If there's already a report for the corresponding month and year
            // Calculating the new sum of the monthly report
            const oldSum = Number.parseFloat(report[0].totalSum);
            const sumToAdd = Number.parseFloat(costSum);
            const updatedSum = oldSum + sumToAdd;

            // Concatenating the current cost into the list of costs
            let currentListOfCosts = report[0].listOfCosts;
            currentListOfCosts.push(costConcatenation);

            await Report.findOneAndUpdate({id:userId, month:costMonth, year:costYear},
                {totalSum:updatedSum, listOfCosts:currentListOfCosts});

        } else{ // If there isn't any report regarding this date
            const monthlyReport = new Report({id:userId, month:costMonth, year:costYear,
                totalSum:costSum, listOfCosts:costConcatenation});

            monthlyReport.save()
                .catch(error => res.status(400).send('There was a problem saving the report. \n' + error));
        }

        // Saving the new cost into DB.
        await cost.save().then(user => res.status(201).json(user + '\n\n Cost saved successfully!'))
            .catch(error => res.status(400).send('There was a problem saving the cost. \n' + error));
    } else{ // Found error in the inputs
        res.status(404).send(message); }
});

/**
 * Fetch all costs from DB, if none exists, get a corresponding message.
 */
router.get('/getall', async function(req, res) {
    const costs = await Cost.find({});

    if(costs.length === 0){
        res.status(404).send('There aren\'t any saved costs');
    }else{
        res.status(200).send(costs);
    }
});

// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
const express = require('express');
const Cost = require('../schemas/costschema');
const Report = require('../schemas/reportschema');
const router = express.Router();

/**
 * Add a new cost into the 'costs' collection into the database.
 * Return a corresponding message if any error occurs.
 */
router.post('/add', async function(req, res) {
    let cost;

    cost = new Cost({id:req.query.id, description:req.query.description,
        sum:req.query.sum, date:req.query.date, category:req.query.category});

    const date = new Date(req.query.date);

    if(isNaN(date)){ // If the inputted date wasn't valid.
        res.status(400).send('Invalid date input, please try again.');
    } else{
        const yearToCheck = date.getFullYear();
        const monthToCheck = date.getMonth() + 1;

        // Check if there's an existing report of this specific month and date
        const report = await Report.find({id:req.query.id, month:date.getMonth()+1, year:date.getFullYear()});

        // Creating a template for a cost to be included in a future report
        let costConcatenation = `\n${req.query.description}, Category: ${req.query.category}, `
            + `Sum: ${req.query.sum}`;

        if(report.length === 1){ // If there's already a report for the corresponding month and year

            // Calculating the new sum of the monthly report
            const oldSum = Number.parseFloat(report[0].totalSum);
            const sumToAdd = Number.parseFloat(req.query.sum)
            const updatedSum = oldSum + sumToAdd;

            // Concatenating the current cost into the list of costs
            let currentListOfCosts = report[0].listOfCosts;
            currentListOfCosts += costConcatenation;

            await Report.findOneAndUpdate({id:req.query.id, month:monthToCheck, year:yearToCheck},
                {totalSum:updatedSum, listOfCosts:currentListOfCosts});
        }else { // If there isn't any report regarding this date
            const monthlyReport = new Report({id:req.query.id, month:monthToCheck, year:yearToCheck,
                totalSum:req.query.sum, listOfCosts:costConcatenation});

            monthlyReport.save()
                .catch(error => res.status(400).send('There was a problem saving the report. \n' + error));
        }

        // Saving the new cost into DB.
        await cost.save().then(user => res.status(201).json(user + '\n\n Cost saved successfully!'))
            .catch(error => res.status(400).send('There was a problem saving the cost. \n' + error));
    }
});

/**
 * Fetch all costs from DB, if none exists, get a corresponding message.
 */
router.get('/getall', async function(req, res) {
    let costs;
    costs = await Cost.find({});

    if(costs.length === 0){
        res.status(404).send('There aren\'t any saved costs');
    }else{
        res.status(200).send(costs);
    }
});

/**
 * Delete all the costs that exist in the 'costs' collection.
 */
router.delete('/deleteall', async function(req, res) {
    await Cost.deleteMany({})
        .then(() => res.status(200).send('All of the costs were successfully deleted.'))
        .catch(error => res.status(400).send('There was a problem deleting costs. \n' + error));
});

// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
const express = require('express');
const costModel = require("../schemas/costschema");
const router = express.Router();
const reportModel = require("../schemas/reportschema");

/**
 * Add a new cost into the 'costs' collection into the database.
 * Return a corresponding message if any error occurs.
 */
router.post('/add', async function(req, res) {
    let cost;

    cost = new costModel({id:req.query.id, description:req.query.description,
        sum:req.query.sum, date:req.query.date, category:req.query.category});

    const date = new Date(req.query.date);
    const yearToCheck = date.getFullYear();
    const monthToCheck = date.getMonth() + 1;

    const report = await reportModel.find({id:req.query.id, month:date.getMonth()+1, year:date.getFullYear()});

    if(report.length === 1){ // If there's already a report for the corresponding month and year
        const oldSum = Number.parseFloat(report[0].totalSum);
        const sumToAdd = Number.parseFloat(req.query.sum)

        const updatedSum = oldSum + sumToAdd;
        await reportModel.findOneAndUpdate({id:req.query.id, month:monthToCheck, year:yearToCheck},
            {totalSum:updatedSum});
    } else{
        const monthlyReport = new reportModel({id:req.query.id, month:monthToCheck, year:yearToCheck,
            totalSum:req.query.sum});

        monthlyReport.save()
            .catch(error => res.status(400).send('There was a problem saving the report. \n' + error));
    }

    // Saving the new cost into DB.
    cost.save().then(user => res.status(201).json(user + '\n\n Cost saved successfully!'))
        .catch(error => res.status(400).send('There was a problem saving the cost. \n' + error));
});

/**
 * Fetch all costs from DB, if none exists, get a corresponding message.
 */
router.get('/getall', async function(req, res) {
    let costs;
    costs = await costModel.find({});

    if(costs.length === 0){
        res.status(200).send('There aren\'t any saved costs');
    }
    else{
        res.status(200).send(costs);
    }
});

/**
 * Delete all the costs that exist in the 'costs' collection.
 */
router.delete('/deleteall', async function(req, res) {
    costModel.deleteMany({})
        .then(() => res.status(200).send('All of the costs were successfully deleted.'))
        .catch(error => res.status(400).send('There was a problem deleting costs. \n' + error));
});

// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
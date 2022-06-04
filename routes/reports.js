const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const reportSchema = new mongoose.Schema({
    id:String,
    month:Number,
    year:Number,
    totalSum:Number
});

/*const costSchema = new mongoose.Schema({
    id:String,
    description:String,
    sum:Number,
    date:Date,
    category:String
});*/

const reportModel = mongoose.model('reports', reportSchema);
//const costModel = mongoose.model('costs', cost);
const costModel = require('./costs');
router.get('/get', async function(req, res) {
    // Params of wanted report to fetch
    const {idToFetch, monthToFetch, yearToFetch} = req.params;
    const dateStringRepresentation = yearToFetch + '-' + monthToFetch + '-';

    let monthlyReport;
    monthlyReport = await reportModel.find({id:idToFetch, month:monthToFetch, year:yearToFetch})
        .catch(error => res.status(400)
            .send('There was a problem retrieving the wanted report. \n' + error));

    if(monthlyReport.length === 1){ // Report exists in DB and was fetched successfully
        res.status(200).send(`Total sum for ${monthToFetch}/${yearToFetch} is ${monthlyReport[0].totalSum}`);
    }
    else{ // A report doesn't exist in the collection, create one, save it on the db and show the sum to the user.
        let costsArray;
        costsArray = costModel.find({id:idToFetch, date:{$gte:dateStringRepresentation+'01',
                $lte:dateStringRepresentation+'31'}});

        let sum = 0;
        costsArray.forEach(cost => sum+=cost['totalSum']);

        monthlyReport = new costModel({id:idToFetch, monthToFetch, yearToFetch, sum});

        monthlyReport.save().then(report => res.status(201)
            .send('Report was created successfully!\n\n'
            +`Total sum for ${monthToFetch}/${yearToFetch} is ${monthlyReport[0].totalSum}`)
            .catch(error => res.status(400).send('There was a problem saving the report. \n' + error)));
    }
});

/*router.post('/add', function(req, res, next) {
    let {id, month, year, totalSum} = req.params;
    let report;
    report = new reportModel({id:id, month:month, year:year, totalSum:totalSum});

    // Saving the new report into DB.
    report.save().then(report => res.status(201).json(report) + '\n\nReport saved successfully!')
        .catch(error => res.status(400).send('There was a problem saving the report. \n' + error));
});*/

module.exports = router;
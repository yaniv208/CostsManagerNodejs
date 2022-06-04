const express = require('express');
const costModel = require("../schemas/costschema");
const reportModel = require("../schemas/reportschema");
const router = express.Router();

router.get('/get', async function(req, res) {
    // Params of wanted report to fetch
    let idToCheck = req.query.id;
    let monthToCheck = req.query.month;
    let yearToCheck = req.query.year;
    const dateStringRepresentation = yearToCheck + '-' + monthToCheck + '-';

    let monthlyReport;
    monthlyReport = await reportModel.find({id:idToCheck, month:monthToCheck, year:yearToCheck})
        .catch(error => res.status(400)
            .send('There was a problem retrieving the report. \n' + error));

    // TODO make report unique
    if(monthlyReport.length === 1){ // Report exists in DB and was fetched successfully
        res.status(200).send(`Total sum for ${monthToCheck}/${yearToCheck} is ${monthlyReport[0].totalSum}`);
    }
    else{ // A report doesn't exist in the collection, create one, save it on the db and show the sum to the user.
        let costsArray = [];
        costsArray = await costModel.find({id:idToCheck,
            date:{$gte:dateStringRepresentation+'01', $lte:dateStringRepresentation+'31'}});

        let sum = 0;
        costsArray.forEach(cost => sum+=cost.sum);

        monthlyReport = new reportModel({id:idToCheck, month:monthToCheck, year:yearToCheck, totalSum:sum});

        monthlyReport.save().then(report => res.status(201)
            .send('Report was created successfully!\n\n'
            +`Total sum for ${monthToCheck}/${yearToCheck} is ${monthlyReport.totalSum}`)
            .catch(error => res.status(400).send('There was a problem saving the report. \n' + error)));
    }
});

module.exports = router;
const express = require('express');
const reportModel = require("../schemas/reportschema");
const router = express.Router();

router.get('/get', async function(req, res) {
    // Params of wanted report to fetch
    let idToCheck = req.query.id;
    let monthToCheck = req.query.month;
    let yearToCheck = req.query.year;

    let monthlyReport;
    monthlyReport = await reportModel.find({id:idToCheck, month:monthToCheck, year:yearToCheck})
        .catch(error => res.status(400)
            .send('There was a problem retrieving the report. \n' + error));

    if(monthlyReport.length === 1){ // Report exists in DB and was fetched successfully
        res.status(200).send(`Total sum for ${monthToCheck}/${yearToCheck} is ${monthlyReport[0].totalSum}`);
    }
    else{ // A report doesn't exist in the collection, create one, save it on the db and show the sum to the user.
        res.status(200).send(`No report for ${monthToCheck}/${yearToCheck} was found.`);
    }
});

module.exports = router;
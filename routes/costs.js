const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const costSchema = new mongoose.Schema({
    id:String,
    description:String,
    sum:Number,
    date:Date,
    category:String
});

const costModel = new mongoose.model('costs', costSchema);

/**
 * Add a new cost into the 'costs' collection into the database.
 * Return a corresponding message if any error occurs.
 */
router.post('/add', function(req, res, next) {
    let cost;

    cost = new costModel({id:req.params.id, description:req.params.description,
        sum:req.params.sum, date:req.params.date, category:req.params.category});

    // Saving the new cost into DB.
    cost.save().then(user => res.status(201).json(user) + '\n\nCost saved successfully!')
        .catch(error => res.status(400).send('There was a problem saving the cost. \n' + error));
});

/**
 * Fetch all costs from DB, if none exists, get a corresponding message.
 */
router.get('/getall', async function(req, res, next) {
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

router.delete('/deleteall', async function(req, res, next) {
    costModel.deleteMany({})
        .then(costs => res.status(200).send('All of the costs were successfully deleted.'))
        .catch(error => res.status(400).send('There was a problem deleting costs. \n' + error));
});

// Mapping a router and all logic that's required to map into specific endpoint.
module.exports = router;
//module.exports = mongoose.model('costs', costSchema);
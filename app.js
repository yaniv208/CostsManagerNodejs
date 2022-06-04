const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Setting routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const reportsRouter = require('./routes/reports');
const costsRouter = require('./routes/costs');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Match specific endpoints to routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reports', reportsRouter);
app.use('/costs', costsRouter);

// Instantiate a connection to db, specifically to 'costmanager' database.
mongoose.connect('mongodb+srv://yaniv208:Shlomo55@cluster0.8zqxl.mongodb.net/costmanager')
    .catch(error => console.log(error));

module.exports = app;
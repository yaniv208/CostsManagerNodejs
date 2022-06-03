const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

// Setting routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// view engine setup + favicon
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Match specific endpoints to routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

mongoose.connect('mongodb+srv://yaniv208:Shlomo55@cluster0.8zqxl.mongodb.net/costmanager')
    .catch(error => console.log(error));

// Connect to db
module.exports = app;
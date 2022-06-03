const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


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

//TODO: Fix connection to DB
mongoose.connect('mongodb+srv://yaniv208:Shlomo55@cluster0.8zqxl.mongodb.net/test');

// Connect to db
module.exports = app;
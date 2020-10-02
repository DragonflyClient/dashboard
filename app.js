var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@45.85.219.34:27017/dragonfly`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    console.log('Connected to DB'))

require('dotenv/config')
const MODE = process.env.MODE
const axios = require('axios')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/authentication');
var minecraftRouter = require('./routes/minecraft')
var statisticsRouter = require('./routes/statistics')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors({ credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API ROUTES
app.use('/auth', authRouter);
app.use('/minecraft', minecraftRouter)
app.use('/statistics', statisticsRouter)

app.use('/', indexRouter);

module.exports = app;

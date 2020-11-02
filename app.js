var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const compression = require('compression')

const mongoose = require('mongoose')
const BASE_API_URL = 'http://localhost:1414'

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017/dragonfly`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    console.log('Connected to DB'))

require('dotenv/config')
const MODE = process.env.MODE
const axios = require('axios')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/authentication');
var minecraftRouter = require('./routes/minecraft')
var statisticsRouter = require('./routes/statistics')
var partnerRouter = require('./routes/partner')
var linkRouter = require('./routes/link')

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({ credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// const secureAuth = async function (req, res, next) {
//     const dragonflyToken = req.cookies["dragonfly-token"]
//     const dragonflyAccount = await getDragonflyAccount(dragonflyToken)
//     if (!dragonflyToken || !dragonflyAccount) return res.redirect('https://playdragonfly.net/login?ref=https://dashboard.playdragonfly.net');
//     next()
// }

// app.use(secureAuth)

// API ROUTES
app.use(compression())
app.use('/link', linkRouter)

app.use('/', indexRouter);
app.use('/partner', partnerRouter)
app.use('/auth', authRouter);
app.use('/minecraft', minecraftRouter)
app.use('/statistics', statisticsRouter)

app.use(function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('sites/404');
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

async function getDragonflyAccount(token) {
    let account;
    await axios.post(`${BASE_API_URL}/v1/authentication/token`, {}, {
        timeout: 6000,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(result => {
            account = result.data
        })
        .catch(err => {
            console.log(err)
            if (err) {
                console.log(err)
            }
        })

    return account
}

module.exports = app;

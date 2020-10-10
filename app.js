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
var partnerRouter = require('./routes/partner')

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

const secureAuth = async function (req, res, next) {
    const dragonflyToken = req.cookies["dragonfly-token"]
    const dragonflyAccount = await getDragonflyAccount(dragonflyToken)
    if (!dragonflyToken || !dragonflyAccount) return res.redirect('https://playdragonfly.net/login?ref=https://dashboard.playdragonfly.net');
    next()
}

app.use(secureAuth)

// API ROUTES
app.use('/auth', authRouter);
app.use('/minecraft', minecraftRouter)
app.use('/statistics', statisticsRouter)
app.use('/partner', partnerRouter)

app.use('/', indexRouter);

async function getDragonflyAccount(token) {
    let account;
    await axios.post('https://api.playdragonfly.net/v1/authentication/token', {}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(result => {
            console.log(result.data)
            account = result.data
        })
        .catch(err => {
            if (err) console.log("err")
        })

    return account
}

module.exports = app;

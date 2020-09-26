var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

require('dotenv/config')
const MODE = process.env.MODE
const axios = require('axios')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/authentication');

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

// Security while development
app.get('/*', async (req, res) => {
    const dragonflyToken = req.cookies["dragonfly-token"]
    if (!dragonflyToken) return res.render("error", { message: 'Please login in order to see this content.', backUrl: "https://playdragonfly.net", paymentId: null })
    const result = await axios.post('https://api.playdragonfly.net/v1/authentication/token', {}, {
        headers: {
            "Authorization": `Bearer ${dragonflyToken}`
        }
    })
    const dragonflyUsername = result.data.username
    if (MODE === "DEVELOPMENT") {

        if (result.data.permissionLevel <= 8) return res.render("error", { message: 'You don\'t have permission to access this resource.', backUrl: "https://playdragonfly.net", paymentId: null })
        return res.render('index', { title: 'Express!', username: dragonflyUsername });
    }
    res.render('index', { title: 'Express!', username: dragonflyUsername });
})

app.use('/', indexRouter);


module.exports = app;

const express = require('express')
const router = express.Router()

const axios = require('axios').default
const mongoose = require('mongoose')

const SpotifyWebApi = require('spotify-web-api-node');
const AccountLink = require('../models/AccountLink')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `https://dashboard.playdragonfly.net/link/callback`,
});

const BASE_API_URL = 'http://localhost:1414'

var scopes = [
    'user-top-read',
    'user-read-private',
    'user-library-read',
    'user-read-recently-played',
    'user-read-playback-position',
    'user-read-currently-playing',
    'app-remote-control',
    'user-read-recently-played',
    'user-modify-playback-state'
];

var showDialog = true;

const secureAuth = async (req, res, next) => {
    const token = req.cookies["dragonfly-token"]
    if (!token) return res.redirect('https://playdragonfly.net/login?ref=https://dashboard.playdragonfly.net/account')
    const account = await getDragonflyAccount(token)
    console.log(account, "middle")
    if (account == null) {
        return res.status(401).render('error', { message: "Error while authenticating. Please try again later or login", backUrl: null, error: "auth_timeout", final: true })
    }
    req.account = account
    next()
}

router.use(secureAuth)

router.get('/spotify', (req, res) => {
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, showDialog);
    res.redirect(authorizeURL);
})

router.get('/callback', (req, res) => {
    const token = req.cookies["dragonfly-token"]
    const account = req.account
    const authorizationCode = req.query.code
    spotifyApi.authorizationCodeGrant(authorizationCode).then(
        async function (data) {
            console.log(data)
            const accessToken = data.body.access_token
            const refreshToken = data.body.refresh_token
            const newAccountLink = new AccountLink({
                dragonflyUUID: account.uuid,
                access_token: accessToken,
                refresh_token: refreshToken
            })
            const saved = await newAccountLink.save()
            res.send(saved)
        },
        function (err) {
            console.log('Something went wrong when retrieving the access token!', err.message);
            res.send({ success: false, err: err.message })
        }
    );
})

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


module.exports = router
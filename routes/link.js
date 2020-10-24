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
    console.log('link req')
    console.log(req.headers, "headers")
    const token = req.cookies['dragonfly-token'] || req.headers.authorization.split(' ')[1]
    console.log(token, "token")
    if (!token) return res.send({ success: false, message: "Please login" })
    const account = await getDragonflyAccount(token)
    console.log(account, "middl!!e")
    if (account == null) {
        return res.status(401).render('error', { message: "Error while authenticating. Please try again later or login", backUrl: null, error: "auth_timeout", final: true })
    }
    req.account = account
    next()
}

router.use(secureAuth)

router.get('/info/spotify', async (req, res) => {
    console.log('request link')
    const account = req.account
    const accountLink = await AccountLink.findOne({ dragonflyUUID: account.uuid })
    console.log(accountLink, "ACCOUNT LINk")
    if (!accountLink) return res.send({ success: false, message: "Dragonfly account not linked to Spotify" })
    const loggedInSpotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: `https://dashboard.playdragonfly.net/link/callback`,
    });
    loggedInSpotifyApi.setAccessToken(accountLink.access_token)
    loggedInSpotifyApi.setRefreshToken(accountLink.refresh_token)

    if (accountLink.next_expiration < new Date().getTime()) {
        loggedInSpotifyApi.refreshAccessToken().then(
            async function (data) {
                const expiresIn = data.body.expires_in

                const nextExpiration = new Date().getTime() + expiresIn * 1000
                console.log('The access token has been refreshed!');

                // Save the access token so that it's used in future calls
                loggedInSpotifyApi.setAccessToken(data.body['access_token']);
                await AccountLink.findOneAndUpdate({ dragonflyUUID: account.uuid }, { $set: { access_token: data.body['access_token'], next_expiration: nextExpiration, expires_in: expiresIn } })
            },
            function (err) {
                console.log('Could not refresh access token', err);
            }
        );
    }
    const result = loggedInSpotifyApi.getMe()
        .then(function (data) {
            res.send(data.body)
        }, function (err) {
            console.log(err)
        })
    return result
})

router.get('/spotify', async (req, res) => {
    const token = req.cookies["dragonfly-token"]
    const account = req.account
    const accountLink = await AccountLink.findOne({ dragonflyUUID: account.uuid })
    if (accountLink) return res.send({ success: false, message: "Already linked" })
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, showDialog);
    res.redirect(authorizeURL);
})

router.get('/callback', async (req, res) => {
    const token = req.cookies["dragonfly-token"]
    const account = req.account
    const authorizationCode = req.query.code
    spotifyApi.authorizationCodeGrant(authorizationCode).then(
        async function (data) {
            console.log(data)
            const accessToken = data.body.access_token
            const refreshToken = data.body.refresh_token
            const expiresIn = data.body.expires_in
            const nextExpiration = new Date().getTime() + expiresIn * 1000

            const newAccountLink = new AccountLink({
                dragonflyUUID: account.uuid,
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: expiresIn,
                next_expiration: nextExpiration
            })
            const saved = await newAccountLink.save()
            res.redirect('https://dashboard.playdragonfly.net/account')
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
            if (err) {
                console.log(err)
            }
        })

    return account
}


module.exports = router
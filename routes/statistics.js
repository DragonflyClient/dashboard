const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const moment = require('moment')
const axios = require('axios').default

const BASE_API_URL = 'http://localhost:1414'

const secureAuth = async (req, res, next) => {
    console.log('right')
    const token = req.cookies["dragonfly-token"]
    console.log(token, "TOKEn")
    if (!token) return res.redirect('https://playdragonfly.net/login?ref=https://dashboard.playdragonfly.net')
    const account = await getDragonflyAccount(token)
    console.log(account, "middle")
    if (account == null) {
        return res.status(401).render('error', { message: "Error while authenticating. Please try again later or login", backUrl: null, error: "auth_timeout", final: true })
    }
    req.account = account
    next()
}


router.use(secureAuth)

router.get('/ot/total', async (req, res, next) => {
    const token = req.cookies["dragonfly-token"]
    const account = req.account
    const dragonflyUUID = account.uuid
    const statistics = await mongoose.connection.db.collection('statistics').findOne({ dragonflyUUID: dragonflyUUID });

    let totalPlaytime = 0

    if (statistics) {
        totalPlaytime = statistics.onlineTime.total
    }

    res.send({ success: true, totalPlaytime: totalPlaytime })
})

router.get('/ot/month/all', async (req, res) => {
    const token = req.cookies['dragonfly-token']
    const account = req.account
    console.log(account)
    const dragonflyUUID = account.uuid
    const document = await mongoose.connection.db.collection('statistics').findOne({ dragonflyUUID: dragonflyUUID });
    const data = document.onlineTime
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    let currentYear = year - 1
    let currentMonth = month
    const monthsToFill = []

    for (let i = 1; i <= 13; i++) {
        monthsToFill.push(format(currentMonth, currentYear))
        currentMonth++
        if (currentMonth > 12) {
            currentMonth = 1
            currentYear++
        }
    }

    const playTimeYear = monthsToFill.map((key) => {
        return data[key] ? data[key] / 60 : 0
    })

    res.send({ success: true, playTimeYear: playTimeYear })
})

function format(month, year) {
    return month < 10 ? `0${month}/${year}` : `${month}/${year}`
}

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
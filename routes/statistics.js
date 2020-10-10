const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const moment = require('moment')
const axios = require('axios').default

router.get('/ot/total', async (req, res, next) => {
    const token = req.cookies["dragonfly-token"]
    const account = await getDragonflyAccount(token)
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
    const account = await getDragonflyAccount(token)
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

module.exports = router
const express = require('express')
const router = express.Router()

const axios = require('axios').default

router.get('/ot/total', async (req, res, next) => {
    const token = req.cookies["dragonfly-token"]
    const account = await getDragonflyAccount(token)
    const dragonflyUUID = account.uuid
    const statistics = await mongoose.connection.db.collection('statistics').findOne({ dragonflyUUID: dragonflyUUID });
    const totalPlaytime = statistics.onlineTime.total
    let monthlyPlaytime = 0

    for (var key in statistics.onlineTime) {
        if (statistics.onlineTime.hasOwnProperty(key)) {
            const contains = key.split('/')[0] == new Date().getMonth() + 1
            if (contains) monthlyPlaytime = statistics.onlineTime[key]
        }
    }

    res.send({ totalPlaytime: totalPlaytime, monthlyPlaytime: monthlyPlaytime })
})

async function getDragonflyAccount(token) {
    const result = await axios.post('https://api.playdragonfly.net/v1/authentication/token', {}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return result.data
}

module.exports = router
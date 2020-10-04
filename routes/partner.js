const express = require('express')
const router = express.Router()

const axios = require('axios').default
const mongoose = require('mongoose')


router.get('/overview', async (req, res) => {
    const token = req.cookies['dragonfly-token']
    const account = await getDragonflyAccount(token)

    const dragonflyUUID = account.uuid

    const refLink = await mongoose.connection.db.collection('ref-links').findOne({ uuid: dragonflyUUID });
    const refBonus = await mongoose.connection.db.collection('ref-bonus').findOne({ refUUID: dragonflyUUID });

    console.log(refLink, refBonus)

    let refDetails = {};

    if (!refLink) return res.render("sites/partner/overview", { success: false, account: account, ref: refDetails, path: req.path, message: `Your account is not connected with a ref link.` })

    if (!refBonus) return res.render("sites/partner/overview", { success: false, account: account, path: req.path, message: `No bonus found for ${account.username}` })

    refDetails.amount = refBonus.amount
    refDetails.type = refLink.type
    refDetails.creationDate = refBonus.creationDate

    console.log(Object.keys(refDetails).length === 0 && refDetails.constructor === Object)

    res.render('sites/partner/overview', { account: account, path: req.path, success: true, ref: refDetails })
})

// Api routes
router.get('/ref/info', async (req, res) => {
    const token = req.cookies["dragonfly-token"]
    const account = getDragonflyAccount(token)

    const collectionRefBonus = mongoose.connection.db.collection('ref-bonus')
    const collectionRefLinks = mongoose.connection.db.collection('ref-links')

    const dragonflyUUID = account.uuid

    const refLink = await collectionRefLinks.findOne({ uuid: dragonflyUUID })
    const refBonus = await collectionRefBonus.findOne({ refUUID: dragonflyUUID })

    if (!refLink) return res.status(400).send({ success: false, message: `Your account is not connected with a ref link.` })

    if (!refBonus) return res.status(400).send({ success: false, message: `No bonus found for ${result.data.username}` })
    console.log(result.data, refBonus)

    res.status(200).send({ success: true, type: refLink.type, amount: refBonus.amount, creationDate: refBonus.creationDate })
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
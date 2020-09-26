const express = require('express')
const router = express.Router()
const axios = require('axios').default

router.post('/logout', async (req, res) => {
    res.cookie('dragonfly-token', "expired", { maxAge: 1, httpOnly: true, domain: ".playdragonfly.net" });
    res.send({ success: true, message: "Cleared cookie" })
})

module.exports = router
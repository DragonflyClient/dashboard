const express = require('express')
const router = express.Router()
// const axios = require('axios').default

router.post('/logout', async (req, res) => {
    res.cookie('dragonfly-token', "expired", { maxAge: 0, httpOnly: true, domain: ".playdragonfly.net" }).send({ success: true, message: "Cleared cookie", path: req.path })
})

module.exports = router
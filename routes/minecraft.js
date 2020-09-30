const express = require('express')
const router = express.Router()
const axios = require('axios').default

// router.post('/unlink', async (req, res) => {
//     const itemId = req.body.id
//     const token = req.cookies["dragonfly-token"]
//     console.log(token)
//     const result = await axios.post('https://api.playdragonfly.net/v1/minecraft/cookie/unlink', {}, {
//         headers: {
//             "Authorization": `Bearer ${token}`
//         },
//         data: itemId
//     })

//     res.send({ hey: result.data })
// })

module.exports = router
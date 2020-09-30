var express = require('express');
var router = express.Router();
const axios = require('axios').default;

const secureAuth = async function (req, res, next) {
  console.log(req)
  const dragonflyToken = req.cookies["dragonfly-token"]
  if (!dragonflyToken) return res.redirect(`https://playdragonfly.net/login?ref=https://dashboard.playdragonfly.net${req.path}`)
  next()
}

router.use(secureAuth)

router.get('/', async (req, res) => {
  const token = req.cookies["dragonfly-token"]
  const account = await getDragonflyAccount(token)

  const linkedMinecraftAccounts = account.linkedMinecraftAccounts

  const mcAccounts = []
  for (let i = 0; i < linkedMinecraftAccounts.length; i++) {
    console.log(linkedMinecraftAccounts[i])
    const accountName = await getMinecraftName(linkedMinecraftAccounts[i])
    const mcAcc = {
      minecraftName: accountName,
      uuid: linkedMinecraftAccounts[i],
    }
    mcAccounts.push(mcAcc)
  }
  console.log(mcAccounts)

  res.render('sites/index', { account: account, linkedMinecraftAccounts: mcAccounts, path: req.path })
})

router.get('/cosmetics', async (req, res) => {
  const token = req.cookies["dragonfly-token"]
  const account = await getDragonflyAccount(token)
  console.log(account, token)
  res.render('sites/cosmetics', { username: account.username, path: req.path })
})

async function getDragonflyAccount(token) {
  const result = await axios.post('https://api.playdragonfly.net/v1/authentication/token', {}, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return result.data
}

async function getMinecraftName(uuid) {
  const response = await axios.get(`https://api.minetools.eu/uuid/${uuid}`);
  return response.data.name;
}

// Security while development
// router.get('/', async (req, res) => {
//   const dragonflyToken = req.cookies["dragonfly-token"]
//   if (!dragonflyToken) return res.render("error", { message: 'Please login in order to see this content.', backUrl: "https://playdragonfly.net", paymentId: null })
//   const result = await axios.post('https://api.playdragonfly.net/v1/authentication/token', {}, {
//     headers: {
//       "Authorization": `Bearer ${dragonflyToken}`
//     }
//   })
//   const dragonflyUsername = result.data.username
//   if (MODE === "DEVELOPMENT") {
//     if (result.data.permissionLevel <= 8) return res.render("error", { message: 'You don\'t have permission to access this resource.', backUrl: "https://playdragonfly.net", paymentId: null })
//     return res.render('index', { title: 'Express!', username: dragonflyUsername });
//   }
//   res.render('index', { title: 'Express!', username: dragonflyUsername })
// })

module.exports = router;

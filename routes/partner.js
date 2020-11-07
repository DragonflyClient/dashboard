const express = require('express');
const router = express.Router();

const axios = require('axios').default;
const mongoose = require('mongoose');

const BASE_API_URL = 'http://localhost:1414';

const requirePerms = async function (req, res, next) {
	const token = req.cookies['dragonfly-token'];
	const account = await getDragonflyAccount(token);
	if (account == null || account.permissionLevel < 9) {
		res.status(401).render('error', { message: 'Insufficient permissions', backUrl: null, error: 'insufficient_perms', final: false });
	} else {
		req.account = account;
		next();
	}
};

router.use(requirePerms);

router.get('/overview', async (req, res) => {
	const token = req.cookies['dragonfly-token'];
	const account = req.account;

	const dragonflyUUID = account.uuid;

	let refAmount;

	await axios
		.get(`${BASE_API_URL}/v1/partner/referral`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(result => {
			console.log(result.data, 'RES');
		})
		.catch(err => {
			console.log(err.response.data);
			refAmount = err.response.data.error;
		});
	console.log(refAmount, 'RA');

	// if (!refLink) return res.render('sites/partner/overview', { success: false, account: account, ref: refDetails || null, path: req.path, message: `Your account is not connected with a ref link.` });

	// if (!refBonus) return res.render('sites/partner/overview', { success: false, account: account, path: req.path, ref: 0, message: `No bonus found for ${account.username}` });

	// refDetails.amount = refBonus.amount;
	// refDetails.type = refLink.type;
	// refDetails.creationDate = refBonus.creationDate;
	// refDetails.count = refBonus.count;

	res.render('sites/partner/overview', { account: account, path: req.path, success: true, refAmount: refAmount });
});

// Api routes
router.get('/ref/info', async (req, res) => {
	const token = req.cookies['dragonfly-token'];
	const account = req.account;

	axios
		.get(`${BASE_API_URL}/v1/partner/referral`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(result => {
			console.log(result.data, 'RES');
		})
		.catch(err => {
			console.log(err);
		});

	// const collectionRefBonus = mongoose.connection.db.collection('ref-bonus')
	// const collectionRefLinks = mongoose.connection.db.collection('ref-links')

	// const dragonflyUUID = account.uuid

	// const refLink = await collectionRefLinks.findOne({ uuid: dragonflyUUID })
	// const refBonus = await collectionRefBonus.findOne({ refUUID: dragonflyUUID })

	// if (!refLink) return res.status(400).send({ success: false, message: `Your account is not connected with a ref link.` })

	// if (!refBonus) return res.status(400).send({ success: false, message: `No bonus found for ${result.data.username}` })
	// console.log(result.data, refBonus)

	// res.status(200).send({ success: true, type: refLink.type, amount: refBonus.amount, creationDate: refBonus.creationDate })
});

async function getDragonflyAccount(token) {
	let account;
	await axios
		.post(
			`${BASE_API_URL}/v1/authentication/token`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)
		.then(result => {
			account = result.data;
		})
		.catch(err => {
			if (err) console.log('err');
		});

	return account;
}

module.exports = router;

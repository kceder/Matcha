const express = require('express');
const verifyToken = require('../utils/verifyToken.js')

const tokenValidator = async (request, response) => {
	const token = request.cookies.token;
	if (token === undefined) {
		response.send('no token')
	} else {
		const user = await verifyToken(token)
		if (user) {
			response.send('valid');
		} else {
			response.send('token invalid');
		}
	}
}

const validatorRouter = express.Router();

validatorRouter.route('/api/validator').post(tokenValidator);

module.exports = validatorRouter;
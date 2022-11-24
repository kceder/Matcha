const express = require('express');
const statsController = require('../controllers/stats.js')
const statsRouter = express.Router();

const verifyToken = require('../utils/verifyToken.js')

const tokenValidator = (request, response, next) => {
	const token = request.cookies.token;
	const user = verifyToken(token)
	request.user = user;
	if (user) {
		next();
	} else {
		response.send('token invalid')
		return null
	}
}

statsRouter.route('/api/stats/get-stats').post(tokenValidator, statsController.getStats);
statsRouter.route('/api/stats/view').post(tokenValidator, statsController.addView);
statsRouter.route('/api/stats/like').post(tokenValidator, statsController.addLike)
// statsRouter.route('/api/stats/match').post(statsController.)
// statsRouter.route('/api/stats/block').post(statsController.)

module.exports = statsRouter;
const express = require('express');
const notificationsController = require('../controllers/notifications.js')
const notificationsRouter = express.Router();
const verifyToken = require('../utils/verifyToken.js')

const tokenValidator = async (request, response, next) => {
	const token = request.cookies.token;
	const user = await verifyToken(token)
	request.user = user;
	if (user != false) {
		next();
	} else {
		response.send('token invalid')
	}
}



notificationsRouter.route('/api/notifications/view').post(tokenValidator, notificationsController.viewNotification);
notificationsRouter.route('/api/notifications/liked').post(tokenValidator, notificationsController.likedNotification);
notificationsRouter.route('/api/notifications/disliked').post(tokenValidator, notificationsController.dislikedNotification);
notificationsRouter.route('/api/notifications').post(tokenValidator, notificationsController.getNofications);
notificationsRouter.route('/api/notifications/read').post(tokenValidator, notificationsController.readNotifications);


module.exports = notificationsRouter;
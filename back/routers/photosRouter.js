const express = require('express');

const photosController = require('../controllers/photos');
const photosRouter = express.Router();

const verifyToken = require('../utils/verifyToken.js')

const tokenValidator = async (request, response, next) => {
	const token = request.cookies.token;
	const user = await verifyToken(token)
	request.user = user;
	if (user) {
		next();
	} else {
		response.send('token invalid')
		return null
	}
}

photosRouter.route('/api/photos/user').post(tokenValidator, photosController.getPhotos);
photosRouter.route('/api/photos/profile').post(tokenValidator, photosController.setProfilePicture);
photosRouter.route('/api/photos').post(tokenValidator, photosController.setPicture);

module.exports = photosRouter;
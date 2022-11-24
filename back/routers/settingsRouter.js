const express = require('express');
const settingsController = require('../controllers/settings.js')
const multer  = require('multer')
const settingsRouter = express.Router();

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

const fileStorage = multer.diskStorage({
	destination : (request, file, callBack) => {
		callBack(null, './images/')
	},
	filename: (request, file, callBack) => {
		callBack(null, "img_" + Date.now() + ".png")
	}
})

const upload = multer({ storage: fileStorage })

settingsRouter.route('/api/settings/password').post(tokenValidator, settingsController.changePassword)
settingsRouter.route('/api/settings/changeUserInfo').post(tokenValidator, settingsController.changeUserInfo)
settingsRouter.route('/api/settings/restorePassword').post(settingsController.restorePassword)
settingsRouter.route('/api/settings/passwordRestore').post(settingsController.passwordRestore)

module.exports = settingsRouter;
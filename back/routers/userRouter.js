const express = require('express');
const userController = require('../controllers/users.js')
const multer  = require('multer')
const userRouter = express.Router();
const verifyToken = require('../utils/verifyToken.js')

const tokenValidator = (request, response, next) => {
	const token = request.cookies.token;
	const user = verifyToken(token)
	request.user = user;
	if (user != false) {
		next();
	} else {
		response.send('token invalid')
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


userRouter.route('/api/login').post(userController.login);
userRouter.route('/api/register').post(userController.register);
userRouter.route('/api/users/activate').post(userController.activateUser);
userRouter.route('/api/users/getUser').post(tokenValidator ,userController.getUser);
userRouter.route('/api/users/complete-account').post(tokenValidator, userController.completeAccount);
// userRouter.route('/api/users/complete-account/pictures').post(upload.single('image'), userController.addPhotos);
userRouter.route('/api/users/complete-account/pictures').post(tokenValidator, upload.array('images', 5), userController.addPhotos);
userRouter.route('/api/users/filter').post(tokenValidator ,userController.filterUsers);
userRouter.route('/api/users/check-acti-stat').post(tokenValidator ,userController.checkActiStat);

userRouter.route('/api/users').get(userController.getAllUsers);
userRouter.route('/api/users/getLoggedInUsers').post(tokenValidator, userController.getLoggedInUsers);
userRouter.route('/api/logout').post(tokenValidator, userController.logOut);


module.exports = userRouter;
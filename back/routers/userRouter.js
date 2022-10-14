const express = require('express');
const userController = require('../controllers/users.js')
const multer  = require('multer')
const userRouter = express.Router();

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
userRouter.route('/api/users/getUser').post(userController.getUser);
userRouter.route('/api/users/complete-account').post(userController.completeAccount);
// userRouter.route('/api/users/complete-account/pictures').post(upload.single('image'), userController.addPhotos);
userRouter.route('/api/users/complete-account/pictures').post(upload.array('images', 5), userController.addPhotos);

userRouter.route('/api/users').get(userController.getAllUsers);


module.exports = userRouter;
const express = require('express');
const userController = require('../controllers/users.js')

const userRouter = express.Router();

userRouter.route('/api/login').post(userController.login);
userRouter.route('/api/register').post(userController.register);
userRouter.route('/api/users/activate').post(userController.activateUser);
userRouter.route('/api/users/complete-account').post(userController.completeAccount);
userRouter.route('/api/users').get(userController.getAllUsers);

module.exports = userRouter;
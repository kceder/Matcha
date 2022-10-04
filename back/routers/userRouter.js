const express = require('express');
const userController = require('../controllers/users.js')

const userRouter = express.Router();

userRouter.route('/api/users').get(userController.getAllUsers);
userRouter.route('/api/users/activate').post(userController.activateUser);
userRouter.route('/api/login').post(userController.login);
userRouter.route('/api/register').post(userController.register);

module.exports = userRouter;
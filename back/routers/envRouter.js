const express = require('express');
const envController = require('../controllers/env.js')

const envRouter = express.Router();

envRouter.route('/api/env/geoapikey').post(envController.geoApi);

module.exports = envRouter;

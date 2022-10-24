const express = require('express');
const envController = require('../controllers/env.js')

const envRouter = express.Router();

envRouter.route('/api/env/geoapikey').post(envController.geoApi);
envRouter.route('/api/env/reversegeoapikey').post(envController.reverseGeoApi);

module.exports = envRouter;

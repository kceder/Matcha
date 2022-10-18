const express = require('express');
const locationController = require('../controllers/location.js')

const locationRouter = express.Router();

locationRouter.route('/api/location/gps').post(locationController.updateGpsLocation);
locationRouter.route('/api/location/ip').post(locationController.updateIpLocation);

module.exports = locationRouter;
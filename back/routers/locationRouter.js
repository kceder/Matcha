const express = require('express');
const locationController = require('../controllers/location.js')

const locationRouter = express.Router();

locationRouter.route('/api/location/update').post(locationController.updateLocation);

module.exports = locationRouter;
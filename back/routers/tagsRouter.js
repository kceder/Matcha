const express = require('express');
const tagsController = require('../controllers/tags.js')

const tagsRouter = express.Router();

tagsRouter.route('/api/tags').get(tagsController.getTags);

module.exports = tagsRouter;
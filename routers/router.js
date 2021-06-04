const express = require('express');
const routers = express.Router();
const controllers = require('../controllers/controllers')

routers.get('/', controllers.home)
routers.get('/get_questions', controllers.startScraping)

module.exports = routers;
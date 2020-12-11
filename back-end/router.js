const express = require('express');
const AuthController = require('./controllers/authentication');
const DataController = require('./controllers/dataController')
var cors = require('cors')

module.exports = function (app) {
    // Initializing route groups
    //console.log("starting now...");
    const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        dataRoutes = express.Router()

    //= ========================
    // User Routes
    //= ========================
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/api', dataRoutes);

    //Login User
    authRoutes.post('/login', cors(),AuthController.login);
    dataRoutes.post('/uploadFile', cors(), DataController.uploadFile);
    dataRoutes.get('/getData', cors(), DataController.getData);
	
    app.use('/', apiRoutes);
};

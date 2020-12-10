const express = require('express');
const AuthController = require('./controllers/authentication');
const DataController = require('./controllers/dataController')

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
    authRoutes.post('/login', AuthController.login);
	

};

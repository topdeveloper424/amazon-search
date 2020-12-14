const express = require('express');
const AuthController = require('./controllers/authentication');
const DataController = require('./controllers/dataController')
const HistoryController = require('./controllers/historyController')
const cors = require('cors')

module.exports = function (app) {
    // Initializing route groups
    //console.log("starting now...");
    const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        dataRoutes = express.Router(),
        historyRoutes = express.Router()

    //= ========================
    // User Routes
    //= ========================
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/data', dataRoutes);
    apiRoutes.use('/history', historyRoutes);
    

    //Login User
    authRoutes.post('/login', AuthController.login);

    // data source
    dataRoutes.post('/uploadFile', DataController.uploadFile);
    dataRoutes.get('/getData', DataController.getData);

    //history 
    historyRoutes.get('/getLastHistory', HistoryController.getLastHistory);

    app.use('/', apiRoutes);
};

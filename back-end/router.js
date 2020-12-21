const express = require('express');
const AuthController = require('./controllers/authentication');
const DataController = require('./controllers/dataController')
const HistoryController = require('./controllers/historyController')
const SavedSearchController = require('./controllers/savedSearchController')
const cors = require('cors')

module.exports = function (app) {
    // Initializing route groups
    //console.log("starting now...");
    const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        dataRoutes = express.Router(),
        historyRoutes = express.Router(),
        savedSearchRoutes = express.Router()

    //= ========================
    // User Routes
    //= ========================
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/data', dataRoutes);
    apiRoutes.use('/history', historyRoutes);
    apiRoutes.use('/search', savedSearchRoutes);
    
    

    //Login User
    authRoutes.post('/login', AuthController.login);

    // data source
    dataRoutes.post('/uploadFile', DataController.uploadFile);
    dataRoutes.get('/getData', DataController.getData);
    dataRoutes.get('/getMissingDates', DataController.getMissingDates);

    //history 
    historyRoutes.get('/getLastHistory', HistoryController.getLastHistory);


    // saved Search
    savedSearchRoutes.post('/saveSearch', SavedSearchController.saveSearch);
    savedSearchRoutes.get('/getSearchNames', SavedSearchController.getSearchNames);
    savedSearchRoutes.post('/getSearchById', SavedSearchController.getSearchById);
    savedSearchRoutes.post('/deleteSearchById', SavedSearchController.deleteSearchById);
    savedSearchRoutes.post('/updateSearchById', SavedSearchController.updateSearchById);

    app.use('/', apiRoutes);
};

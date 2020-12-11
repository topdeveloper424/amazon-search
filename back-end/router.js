const express = require('express');
const AuthController = require('./controllers/authentication');
const DataController = require('./controllers/dataController')
var cors = require('cors')
var corsOptions = {
    origin: function (origin, callback) {
      // db.loadOrigins is an example call to load
      // a list of origins from a backing database
      db.loadOrigins(function (error, origins) {
        callback(error, origins)
      })
    }
  }
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
	
    app.use('/', apiRoutes);
};

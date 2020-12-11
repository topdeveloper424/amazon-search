// Importing Node modules and initializing Express
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan')
const router = require('./router')
const cors = require('cors')
const mongoose  = require("mongoose")
const config = require("./config") 
const busboy = require('connect-busboy');

app.use(cors());


//Setup Database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL, { useNewUrlParser: true , useUnifiedTopology: true});   

// Start the server
let server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Back-end app listening at http://%s:%s", host, port)
})
// Set static file location for production
// app.use(express.static(__dirname + '/public'));

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(express.static('uploads'));
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

// Enable CORS from client-side
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Content-Type', 'application/json; charset=utf-8, application/x-www-form-urlencoded, multipart/form-data');
  next();
});

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
// Importing Node modules and initializing Express
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan')
const router = require('./router')
const cors = require('cors')
const mongoose  = require("mongoose")
const mongoUrl = require("./config") 

app.use(cors());


//Setup Database connection
// mongoose.Promise = global.Promise;
// mongoose.connect(mongoUrl, { useNewUrlParser: true });   

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

// Enable CORS from client-side
app.use((req, res, next) => {
  var allowedOrigins = ['http://localhost:8080', 'http://localhost:3001'];
  var origin = req.headers.origin;
  console.log("origin: " + origin);
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
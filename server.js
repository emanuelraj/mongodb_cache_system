let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');

//Accessing configuration
let config = require('config');

let mongoose = require('mongoose');

mongoose.connect(config.DBHost);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Controller import
let CacheController = require('./app/caches/CacheController');

//Preventing console in test mode 
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}


app.use('/api/v1/cache', CacheController);

//Listening to port
app.listen(config.port, function(){
    console.log('App started running in port ' + config.port);
});

module.exports = app;
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

app.get('/', function(req, res){
    console.log('Success');
    res.send("Success");
})

//Listening to port
app.listen(config.port, function(){
    console.log('App started running in port ' + config.port);
});
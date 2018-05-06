var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

//Cache Model Import
var Cache = require('../../models/cache');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//Get Cache Details
router.get('/', function(req, res, next){
    if(req.query.key){
        //Get Cache Details by ID
        return res.status(200).json({data: [], message: "cache fetched by Id successfully"});
    }else{
        //Get All Cache Details
        return res.status(200).json({data: [], message: "cache fetched successfully"});
    }
});

//Post New Cache
router.post('/', function(req, res, next){
    return res.status(201).json({data: [], message: "cache saved successfully"});
});

//Update Cache Details
router.put('/', function(req, res, next){
    return res.status(200).json({data: [], message: "cache updated successfully"});
});

//Delete Cache Details
router.delete('/', function(req, res, next){
    return res.status(200).json({data: [], message: "cache deleted successfully"});
});

//export CacheController
module.exports = router;
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
    Cache.find({key : req.body.key},function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }
        if(cache.length > 0 ){
            //Update The Key
            updateCache(req, res);
        }else{
            //Insert the Key
            let new_cache = {
                key : req.body.key,
                value : req.body.value
            }

            Cache.create(new_cache, function(err, cache){
                if(err){
                    return res.status(500).json({data: [], message : err});
                }
                return res.status(200).json({data : cache, message : "User Created Successfully"});
            });
        }
    });
});

//Update Cache Details
router.put('/', function(req, res, next){
    updateCache(req, res);
});

//Delete Cache Details
router.delete('/', function(req, res, next){
    if(req.query.key){
        return res.status(200).json({data: [], message: "cache deleted by Id successfully"});
    }else{
        return res.status(200).json({data: [], message: "cache deleted successfully"});
    }
});

//Common function to update cache by key
let updateCache = function(req, res){
    Cache.findOneAndUpdate({key: req.body.key}, {$set:{value: req.body.value, ttl: new Date(+new Date() + 2*60*1000) }}, {new: true}, function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }
        return res.status(200).json({data: cache, message: "cache updated successfully"});
    });
}

//export CacheController
module.exports = router;
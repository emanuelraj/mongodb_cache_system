var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var randomstring = require("randomstring");


//Cache Model Import
var Cache = require('../../models/cache');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//Get Cache Details
router.get('/', function(req, res, next){
    if(req.query.key){
        //Get Cache Details by ID
        Cache.findOne({key : req.query.key},function(err, cache){
            if(err){
                return res.status(500).json({data: [], message : err});
            }
            //console.log(cache);
            if(cache){
                if(cache.ttl <= new Date){
                    updateCache(req, res);
                }else{
                    return res.status(200).json({data: cache, message: "cache fetched successfully"});
                }
                
            }else{
                createCache(req, res);
            }
        });
    }else{
        //Get All Cache Details
        Cache.find({},function(err, cache){
            if(err){
                return res.status(500).json({data: [], message : err});
            }
            if(cache.length > 0 ){
                return res.status(200).json({data: cache, message: "cache fetched successfully"});
            }else{
                return res.status(200).json({data: [], message: "cache is empty"});
            }
        });
    }
});

//Post New Cache
router.post('/', function(req, res, next){
    createCache(req, res);
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

let createCache = function(req, res){
    if(req.method == "GET"){
        req.body.key = req.query.key
    }
    Cache.find({key : req.body.key},function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }
        if(cache.length > 0 ){
            //Update The Key
            updateCache(req, res);
        }else{
            //Insert the Key
            if(!req.body.value){
                req.body.value = randomstring.generate();
            }

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
}


//Common function to update cache by key
let updateCache = function(req, res){
    if(req.method == "GET"){
        req.body.key = req.query.key
    }
    if(!req.body.value){
        req.body.value = randomstring.generate();
    }
    Cache.findOneAndUpdate({key: req.body.key}, {$set:{value: req.body.value, ttl: new Date(+new Date() + 2*60*1000) }}, {new: true}, function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }
        return res.status(200).json({data: cache, message: "cache updated successfully"});
    });
}

//export CacheController
module.exports = router;
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser')
let randomstring = require("randomstring");

let config = require('config');

//Cache Model Import
let Cache = require('../../models/cache');

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
        Cache.findOneAndRemove({ key: req.query.key }, function(err) {
            if (!err) {
                return res.status(200).json({data: [], message: "cache deleted by key successfully"});
            }else {
                return res.status(500).json({data: [], message : err});
            }
        });
    }else{
        Cache.remove({}, (err) => { 
            if (!err) {
                return res.status(200).json({data: [], message: "All cache deleted successfully"});
            }else {
                return res.status(500).json({data: [], message : err});
            }
         });
    }
});


//Common function to Insert cache
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
            //Check if Cache Limit exceeded
            Cache.count({}, function(err, count) {
                if(count == config.CacheLimit){
                    //Find the oldest ttl of all the cache and removes it so that the new cache can be created
                    Cache.findOne({})
                        .sort({ ttl: 1})
                        .exec(function(err, cache_details) {
                        console.log(cache_details);
                        Cache.findOneAndRemove({ key: cache_details.key }, function(err) {
                            if (err) {
                                return res.status(500).json({data: [], message : err});
                            }
                        });
                    });
                }
            
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
                    return res.status(200).json({data : cache, message : "Cache Created Successfully"});
                });
                
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
    Cache.findOneAndUpdate({key: req.body.key}, {$set:{value: req.body.value, ttl: new Date(+new Date() + config.TTLExpireDuration*60*1000) }}, {new: true}, function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }
        return res.status(200).json({data: cache, message: "cache updated successfully"});
    });
}

//export CacheController
module.exports = router;
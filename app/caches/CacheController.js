let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser')
let randomstring = require("randomstring");

let config = require('config');

//Cache Model Import
let Cache = require('../../models/cache');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


/*
* GET Method for Cache Deatails
*
**/
router.get('/', function(req, res, next){

    if(req.query.key){
        //Get Cache Details by Key
        Cache.findOne({key : req.query.key},function(err, cache){
            if(err){
                return res.status(500).json({data: [], message : err});
            }
            if(cache){
                console.log("Cache hit");
                //Check if the ttl expires
                if(cache.ttl <= new Date){
                    // Update the value with random string and reset ttl
                    updateCache(req, res);
                }else{
                    //return cache details
                    return res.status(200).json({data: cache, message: "cache fetched successfully"});
                }
                
            }else{
                // If the Key is not available create new cache 
                console.log("Cache miss");
                createCache(req, res);
            }
        });
    }else{
        //Get All Cache Details
        Cache.find({},function(err, cache){
            if(err){
                return res.status(500).json({data: [], message : err});
            }

            //check the cache is empty or not
            if(cache.length > 0 ){
                return res.status(200).json({data: cache, message: "cache fetched successfully"});
            }else{
                return res.status(200).json({data: [], message: "cache is empty"});
            }
        });
    }
});


/*
* POST Method for Saving New Cache
*
**/
router.post('/', function(req, res, next){
    //Call the common function for create new cache
    createCache(req, res);
});

/*
* PUT Method for Updating Cache Deatails
*
**/
router.put('/', function(req, res, next){
    //Call the common function for update cache
    updateCache(req, res);
});

/*
* DELETE Method for deleting Cache Deatails
*
**/
router.delete('/', function(req, res, next){

    //Check if there is key available in the request
    if(req.query.key){
        //Delete the cache if the key exists
        Cache.findOneAndRemove({ key: req.query.key }, function(err) {
            if (!err) {
                return res.status(200).json({data: [], message: "cache deleted by key successfully"});
            }else {
                return res.status(500).json({data: [], message : err});
            }
        });
    }else{
        //Delete All the cache 
        Cache.remove({}, (err) => { 
            if (!err) {
                return res.status(200).json({data: [], message: "All cache deleted successfully"});
            }else {
                return res.status(500).json({data: [], message : err});
            }
         });
    }
});



/*
* Insert the new cache if Key Doesn't Exists
*
**/
let createCache = function(req, res){
    
    if(req.method == "GET"){
        req.body.key = req.query.key
    }

    //Check if the key is exists
    Cache.find({key : req.body.key},function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }

        //check if the key already exists
        if(cache.length > 0 ){
            //Update the cache
            updateCache(req, res);
        }else{
            //Check if Cache Limit exceeded
            Cache.count({}, function(err, count) {
                if(count == config.CacheLimit){
                    //Find the oldest ttl of all the cache and removes it so that the new cache can be created
                    Cache.findOne({})
                        .sort({ ttl: 1})
                        .exec(function(err, cache_details) {
                        Cache.findOneAndRemove({ key: cache_details.key }, function(err) {
                            if (err) {
                                return res.status(500).json({data: [], message : err});
                            }
                        });
                    });
                }
                            
                //If cache string is not available, generation random string
                if(!req.body.value){
                    req.body.value = randomstring.generate();
                }

                let new_cache = {
                    key : req.body.key,
                    value : req.body.value
                }

                //Insert New cache
                Cache.create(new_cache, function(err, cache){
                    if(err){
                        return res.status(500).json({data: [], message : err});
                    }
                    return res.status(201).json({data : cache, message : "Cache Created Successfully"});
                });
                
            });
        }
    });
}


/*
* Update the existing cache if Key Exists
*
**/
let updateCache = function(req, res){
    if(req.method == "GET"){
        req.body.key = req.query.key
    }

    //Set random string if the value is not available
    if(!req.body.value){
        req.body.value = randomstring.generate();
    }

    //Update the cache with new value and reset the ttl
    Cache.findOneAndUpdate({key: req.body.key}, {$set:{value: req.body.value, ttl: new Date(+new Date() + config.TTLExpireDuration*60*1000) }}, {new: true}, function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }
        return res.status(200).json({data: cache, message: "cache updated successfully"});
    });
}

//export CacheController
module.exports = router;
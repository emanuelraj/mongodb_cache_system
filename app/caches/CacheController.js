let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser')

let config = require('config');

let filename = './logs/file-record.log';

const log = require('simple-node-logger').createSimpleFileLogger( filename );


//Cache Model Import
let Cache = require('../../models/cache');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());



module.exports = {    
    /*
    * GET ALL Method for Cache Deatails
    *
    **/
    getAll: function (req, res,next) {
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
    },

    /*
    * GET BY KEY Method for Cache Deatails
    *
    **/
    getByKey:function (req, res, next) {
        console.log(req.params);
        if(req.params.key){
            //Get Cache Details by Key
            Cache.findOne({key : req.params.key},function(err, cache){
                if(err){
                    return res.status(500).json({data: [], message : err});
                }
                if(cache){
                    log.info('Cache hit');
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
                    log.info('Cache miss');
                    createCache(req, res);
                }
            });
        }
    },
    /*
    * POST Method for Saving New Cache
    *
    **/
    save:function (req, res, next) {
        createCache(req, res);
    },
    /*
    * PUT Method for Updating Cache Deatails
    *
    **/
    update:function (req, res, next) {
        updateCache(req, res);
    },
    /*
    * DELETE ALL Method for deleting Cache Deatails
    *
    **/
    destroyAll:function (req, res, next) {
        Cache.remove({}, (err) => { 
            if (!err) {
                return res.status(200).json({data: [], message: "All cache deleted successfully"});
            }else {
                return res.status(500).json({data: [], message : err});
            }
        });
    },

    /*
    * DELETE by key Method for deleting Cache Deatails
    *
    **/
    destroy:function (req, res, next) {
        if(req.params.key){
            //Delete the cache if the key exists
            Cache.findOneAndRemove({ key: req.params.key }, function(err) {
                if (!err) {
                    return res.status(200).json({data: [], message: "cache deleted by key successfully"});
                }else {
                    return res.status(500).json({data: [], message : err});
                }
            });
        }
    }
}


/*
* Insert the new cache if Key Doesn't Exists
*
**/
let createCache = function(req, res){
    let search_key;
    let search_value;

    if(req.method == "GET"){
        search_key = req.params.key;
    }else{
        search_key = req.body.key;
    }

    //Check if the key is exists
    Cache.find({key : search_key},function(err, cache){
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
                if(req.method == "GET"){
                    search_value = Math.random().toString(36);
                }else{
                    if(!req.body.value){
                        search_value = Math.random().toString(36);
                    }
                }

                

                let new_cache = {
                    key : search_key,
                    value : search_value
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
    
    let search_key;
    let search_value;

    if(req.method == "GET"){
        search_key = req.params.key;
    }else{
        search_key = req.body.key;
    }
    
    //Set random string if the value is not available
    if(req.method == "GET"){
        search_value = Math.random().toString(36);
    }else{
        if(!req.body.value){
            search_value = Math.random().toString(36);
        }
    }

    //Update the cache with new value and reset the ttl
    Cache.findOneAndUpdate({key: search_key}, {$set:{value: search_value, ttl: new Date(+new Date() + config.TTLExpireDuration*60*1000) }}, {new: true}, function(err, cache){
        if(err){
            return res.status(500).json({data: [], message : err});
        }
        return res.status(200).json({data: cache, message: "cache updated successfully"});
    });
}
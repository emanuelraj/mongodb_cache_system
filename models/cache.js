// Cache Schema
let mongoose = require('mongoose');
let config = require('config')
let Schema = mongoose.Schema;


let CacheSchema = new Schema({
    key : {type: String, required: true},
    value : {type: String, required: true},
    ttl : {type: Date, default: new Date(+new Date() + config.TTLExpireDuration*60*1000)}
});

module.exports = mongoose.model('cache', CacheSchema);
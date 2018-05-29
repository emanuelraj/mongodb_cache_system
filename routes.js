/**
 * Main application routes
 */

'use strict';

//var path = require('path');

module.exports = function(app) {
    app.use('/api/v1/cache', require('./app/caches'));
};
'use strict';

let express = require('express');
let controller = require('./CacheController');
let router = express.Router();

router.get('/', controller.getAll);
router.get('/:key', controller.getByKey);
router.post('/', controller.save);
router.put('/:key', controller.update);
router.delete('/', controller.destroyAll);
router.delete('/:key', controller.destroy);


module.exports = router;

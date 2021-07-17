var express =  require('express');
var router = express.Router();
var control = require('../Controllers/indexControl');

router.get('/',control.indexControl);


module.exports = router;

const express = require('express');
const router = express.Router();
const Control = require('../Controllers/hostellerControl');
const hostellerValidator = require('../Validators/CreateHostellerValidation');
const isWardenAuth = require('../Middlewares/isAuthWarden');
const loginValidator = require('../Validators/loginValidator');
const isHostellerAuth = require('../Middlewares/isAuthHosteller');


router.post('/createhosteller', hostellerValidator, Control.postCreateHosteller);
router.post('/createhostellerbywarden',isWardenAuth ,hostellerValidator, Control.postCreateHostellerByWarden);
router.post('/hostellerlogin', loginValidator,Control.hostellerLogin);


router.get('/mesglist', isHostellerAuth, Control.mesgList);
router.get('/hostellerdata',isHostellerAuth,Control.hostellerData);

module.exports = router;
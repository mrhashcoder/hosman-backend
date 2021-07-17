const express = require('express');
const router = express.Router();
const createHostelValidator = require('../Validators/CreateHostelValidation');
const Control = require('../Controllers/hostelControl');
const loginValidation = require('../Validators/loginValidator');
const isAuthWarden = require('../Middlewares/isAuthWarden');


router.post('/createhostel', createHostelValidator, Control.postCreateHostel);
router.post('/wardenlogin', loginValidation, Control.wardenLogin);
router.post('/approvehosteller', isAuthWarden, Control.approveHosteller);
router.post('/rejecthosteller', isAuthWarden, Control.rejectHosteller);
router.post('/removehosteller', isAuthWarden, Control.removeHosteller);
router.post('/createnotice', isAuthWarden, Control.sendNotice);
router.post('/sendmesg', isAuthWarden, Control.sendMesg);

router.get('/hostellerlist', isAuthWarden, Control.hostellerList);
router.get('/requestlist', isAuthWarden , Control.requestList);
router.get('/noticelist', isAuthWarden ,Control.noticeList);

module.exports = router;

const express = require('express');
const router = express.Router();
const createHostelValidator = require('../Validators/CreateHostelValidation');
const Control = require('../Controllers/hostelControl');
const loginValidation = require('../Validators/loginValidator');
const isAuthWarden = require('../Middlewares/isAuthWarden');


router.post('/hostellers', createHostelValidator, Control.postCreateHostel);
router.post('/wardenlogin', loginValidation, Control.wardenLogin);
router.post('/approvehosteller', isAuthWarden, Control.approveHosteller);
router.post('/rejecthosteller', isAuthWarden, Control.rejectHosteller);
router.post('/removehosteller', isAuthWarden, Control.removeHosteller);
router.post('/notices', isAuthWarden, Control.sendNotice);
router.post('/sendmessage', isAuthWarden, Control.sendMesg);

router.get('/hostellers', isAuthWarden, Control.hostellerList);
router.get('/hostellers/:id', isAuthWarden)
router.get('/requests', isAuthWarden , Control.requestList);
router.get('/notices', isAuthWarden ,Control.noticeList);

module.exports = router;

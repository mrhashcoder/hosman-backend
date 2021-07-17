const jwt = require('jsonwebtoken');
const wardenTokenSecret = process.env.wardenTokenSecret;

module.exports = (req ,res ,next) => {
    const authHeader = req.headers.wardenauth;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, wardenTokenSecret, (err , payload) => {
            if(err){
                console.log(err)
                res.json({Mesg : "Some Authentication Error!"}).status(403);
            }else{
                req.hostelId = payload.hostelId;
                req.warden = payload.warden;
                next();
            }
        })
    }else{
        res.json({Mesg : "Warden is Not Authenticated!!!"}).status(403);
    }
}
const jwt = require('jsonwebtoken');
const hostellerTokenSecret = process.env.hostellerTokenSecret;

module.exports = (req ,res ,next) => {
    const authHeader = req.headers.hostellerauth;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, hostellerTokenSecret, (err , payload) => {
            if(err){
                res.json({Mesg : "Some Authentication Error!"}).status(403);
            }else{
                req.hostellerId = payload.hostellerId;
                req.hostellerName = payload.hostellerName;
                next();
            }
        })
    }else{
        res.json({Mesg : "This Hosteller is Not Authenticated!!!"}).status(403);
    }
}
// Login VAlidation

module.exports = (req , res , next) => {
    try{
        const body = req.body;
        var username = body.username;
        var password = body.password;

        if(!username){
            res.json({Mesg : "Username is not valid"}).status(501);
            return;
        }else if(!password){
            res.json({Mesg : "Password is not valid"}).status(501);
            return;
        }else{
            next();
        }
    }catch(err){
        console.log("ERROR");
        res.json({Mesg : "Some Server Error"}).status(400);
    }
}
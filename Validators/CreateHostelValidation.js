module.exports = createHostelValidation = (req,res,next) => {
    try{
        const body = req.body;
        // console.log(body)
        var hostelName = body.hostelName;
        var collageName = body.collageName;
        var loginUserName = body.loginUserName;
        var loginPassword = body.loginPassword;

        if(!hostelName){
            res.json({Mesg : "Hostel Name is Not Valid"}).status(501);
        }else if(!collageName){
            res.json({Mesg : "Collage Name is Not Valid"}).status(501);
        }else if(!loginUserName){            
            res.json({Mesg : "Warden Name is Not Valid"}).status(501);
        }else if(!loginPassword){
            res.json({Mesg : "Password is Not Valid"}).status(501);
        }else{
            next();
        }

    }catch(err){
        console.log("Error at MiddleWare");
        res.json({Mesg : "Error at Middleware"}).status(400);
    }
}
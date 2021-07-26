// Hostel Control 
const Hostel = require('../Models/Hostel');
const Hosteller = require('../Models/Hosteller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilFunction = require('../utils/UtillFunction')


exports.postCreateHostel = async(req,res) => {
    try{
        const body = req.body;
        var hostelName = body.hostelName;
        var collageName = body.collageName;
        var loginUserName = body.loginUserName;
        var loginPassword = body.loginPassword;
        var hashedPassword = await bcrypt.hash(loginPassword,12);
        var contact = body.contact;     
        var hostellerList = new Array();
        var requestList = new Array();
        var noticeList = new Array();
        var email = body.email;
        var hostelId = utilFunction.getId();
        var findHostel = await Hostel.findOne({loginUserName : loginUserName});
        if(findHostel){
            return res.status(400).json({Mesg : "User Name Taken"});
        }
        var newHostel = new Hostel({
            hostelId : hostelId,
            hostelName : hostelName,
            collageName : collageName,
            hostellerList : hostellerList,
            requestList : requestList,
            noticeList : noticeList,
            loginUserName : loginUserName,
            loginPassword : hashedPassword,
            email : email,
            contact : contact
        });
        await newHostel.save();
        return res.status(200).json({Mesg : "Hostel Created"});
    }catch(err){
        console.log("Error");
        console.log(err);
        return res.status(500).json({mesg : "Some Error"});
    }
}


exports.wardenLogin = async(req , res) => {
    try{
        const body = req.body;
        var username = body.username;
        var password = body.password;

        var findHostel = await Hostel.findOne({loginUserName : username});
        if(!findHostel){
            console.log("Hostel Not Found!!!");
            return res.status(400).json({Mesg : "Hostel with this UserName is Not Found!!!"});
            return;
        }

        bcrypt.compare(password , findHostel['loginPassword'], (err, data) => {
            if(err){
                throw new Error(err);
            }else if(data){
                const payload = {
                    warden : findHostel['loginUserName'],
                    hostelId : findHostel['hostelId'],
                }
                const wardenTokenSecret = process.env.wardenTokenSecret;
                const wardenJwtToken = jwt.sign(payload , wardenTokenSecret , {
                    expiresIn : '365d'
                } );
                return res.status(200).json({
                    success : true,
                    wardenJwtToken : "wardenBearer " + wardenJwtToken,
                });
            }
            else{
                console.log("Incorrect Password!!");
                return res.status(400).json({Mesg : "Incorrect Password!!"});
            }
        })
        
    }catch(err){
        console.log(err);
        return res.status(500).json({Mesg : "Some Error at Server Control"});
    }
}

exports.approveHosteller = async(req, res) => {
    try{
        const hostellerId = req.body.hostellerId;
        if(!hostellerId){
            res.json({Mesg : "Hosteller Id not Recieved!1"}).status(206);
            return;
        }
        await Hosteller.updateOne({hostellerId : hostellerId} ,{approved : true});
        await Hostel.updateOne({hostelId : req.hostelId} , {$pull : {requestList : hostellerId}});
        await Hostel.updateOne({hostelId : req.hostelId} , {$push : {hostellerList : hostellerId}});
        //Sending Whatsapp Mesg
        const findHosteller = await Hosteller.findOne({hostellerId : hostellerId});
        
        const contact = findHosteller['contact'];
        
        return res.status(200).json({Mesg : "Approved!!"});
    }catch(err){
        console.log("Some Error At Server!!");
        console.log(err);
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}

exports.rejectHosteller = async(req, res) => {
    try{
        const hostellerId = req.body.hostellerId;
        if(!hostellerId){
            res.json({Mesg : "HostellerId not Recieved!"}).status(206);
            return;
        }
        await Hosteller.deleteOne({hostellerId : hostellerId});
        await Hostel.updateOne({hostelId : req.hostelId} , {$pull : {requestList : hostellerId}});
        //SEnding Whatsapp Mesg
        const findHosteller = await Hosteller.findOne({hostellerId : hostellerId});
        const contact = findHosteller['contact'];
        
        return res.status(200).json({Mesg : "Hosteller Rejected!!"});
    }catch(err){
        console.log("Some Error at server");
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}

exports.removeHosteller = async(req ,res) => {
    try{
        const hostellerId = req.body.hostellerId;
        if(!hostellerId){
            res.json({Mesg : "HostellerId not Recieved!"}).status(206);
            return;
        }
        await Hosteller.deleteOne({hostellerId : hostellerId});
        await Hostel.updateOne({hostelId : req.hostelId} , {$pull : {hostellerList : hostellerId}});


        return res.status(200).json({Mesg : "Hosteller Removed!!!!"});
    }catch(err){
        console.log("Some Error at server");
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}

exports.requestList = async(req , res) => {
    try{
        const hostelId = req.hostelId;
        const findHostel = await Hostel.findOne({hostelId : hostelId});

        var requestList = findHostel['requestList'];
        var sendList = new Array();
        for(var i = 0 ; i < requestList.length; i++){
            var getHostellerId = requestList[i];
            var getHosteller = await Hosteller.findOne({hostellerId : getHostellerId});

            var sendHosteller = {
                rollNo : getHosteller['rollNo'],
                roomNo : getHosteller['roomNo'],
                hostellerName : getHosteller['hostellerName'],
                contact : getHosteller['contact'],
                email : getHosteller['email']
            };
            sendList.push(sendHosteller);
        }
        return res.status(200).json({Mesg : "Request List" , requestList : sendList});
    }catch(err){
        console.log('Some Error at server');
        console.log(err);
        return res.status(500).json({Mesg : "Some error at server"});
    }
}


exports.hostellerList = async(req ,res) => {
    try{
        const hostelId = req.hostelId;
        const findHostel = await Hostel.findOne({hostelId : hostelId});

        var hostellerList = findHostel['hostellerList'];
        console.log(hostellerList);
        var sendList = new Array();
        for(var i = 0 ; i < hostellerList.length; i++){
            var getHostellerId = hostellerList[i];
            var getHosteller = await Hosteller.findOne({hostellerId : getHostellerId});
            if(!getHosteller){
                continue;
            }
            var sendHosteller = {
                rollNo : getHosteller['rollNo'],
                roomNo : getHosteller['roomNo'],
                hostellerName : getHosteller['hostellerName'],
                contact : getHosteller['contact'],
                email : getHosteller['email']
            };
            sendList.push(sendHosteller);
        }

        return res.status(200).json({Mesg : "Hosteller List" , hostellerList : sendList});
    }catch(err){
        console.log('Some Error at server');
        console.log(err);
        return res.status(500).json({Mesg : "Some error at server"});
    }   
}

exports.sendNotice = async(req, res) => {
    try{
        var noticeData = req.body.noticeData;
        var noticeSubject = req.body.subject;
        if(!noticeData){
            res.json({Mesg : "Invalied Request"}).status(206);
            return;
        }
        if(!noticeSubject){
            res.json({Mesg : "Invalied Request"}).status(206);
            return;
        }  
        const noticePush = {
            data : noticeData,
            date : Date.now(),
            subject : noticeSubject
        };
        await Hostel.updateOne({hostelId : req.hostelId} , {$push : {noticeList : noticePush}});
        return res.json({Mesg : "Notice Sent Successfully"}).status(200);
    }catch(err){
        console.log("Some Error at Server");
        console.log(err);
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}


exports.sendMesg = async(req, res) => {
    try{
        var hostelId = req.hostelId;
        var hostellerId = req.body.hostellerId
        console.log(hostellerId);
        const mesgData = req.body.mesgData;
        if(!hostellerId || !mesgData){
            res.json({Mesg : "Not Recived Data"}).status(206);
            return;
        }
        var mesgPush = {
            data : mesgData
        };
        await Hosteller.updateOne({hostellerId : hostellerId} , {$push : {messageList : mesgPush}});
        return res.status(200).json({Mesg : "Message Sent Succesfully"});
        
    }catch(err){
        console.log(err);
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}

exports.noticeList = async(req ,res) => {
    try{        
        var hostelId = req.hostelId;
        var findHostel = await Hostel.findOne({hostelId : hostelId});
        if(!findHostel){
            console.log("Hostel Not available");
            res.json({Mesg : "Hostel not available at db"}).status(206);
            return;
        }
        var noticeList = findHostel['noticeList'];
        return res.status(200).json({noticelist : noticeList});
    }catch(err){
        console.log(err);
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}


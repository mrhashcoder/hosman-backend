const bcrypt = require('bcrypt');
const Hosteller = require('../Models/Hosteller');
const Hostel = require('../Models/Hostel');
const jwt = require('jsonwebtoken');

exports.postCreateHosteller = async(req , res) => {
    try{
        const body = req.body;
        var hostelId = body.hostelId;
        const findHostel = await Hostel.findOne({hostelId : hostelId});
        if(!findHostel){
            res.json({Mesg : "Hostel Not Found!!!"}).status(501);
        }else{
            var hostellerId = body.rollNo;
            var findHosteller = await Hosteller.findOne({$and : [{hostelId : hostelId} ,{hostellerId : hostellerId}]});
            if(findHosteller){
                return res.status(400).json({Mesg : "Hosteller Already Exists With This Roll No."});
            }
            var rollNo = body.rollNo;
            var hostellerName = body.hostellerName;
            var roomNo = body.roomNo;
            var contact = body.contact;
            var email = body.email;
            var password = body.password;
            var hashedPassword = await bcrypt.hash(password,12);
            var messageList = new Array();
            const newHosteller = new Hosteller({
                hostelId : hostelId,
                hostellerId : hostellerId,
                rollNo : rollNo,
                hostellerName : hostellerName,
                roomNo : roomNo,
                contact : contact,
                email : email,
                password : hashedPassword,
                messageList : messageList,
                approved : false,
            });

            //Pushing hostller into Hostel Request
            await newHosteller.save();
            await Hostel.updateOne({hostelId : hostelId} , {$push : {requestList : hostellerId}});
            
            return res.status(200).json({Mesg : "Created New Hosteller"});
        }       

    }catch(err){
        console.log(err);
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}

exports.postCreateHostellerByWarden = async(req , res) => {
    try{
        const body = req.body;
        var hostelId = req.hostelId;
        const findHostel = await Hostel.findOne({hostelId : hostelId});
        if(!findHostel){
            return res.status(400).json({Mesg : "Hostel Not Found!!!"});
        }else{
            var hostellerId = body.rollNo;
            var findHosteller = await Hosteller.findOne({rollNo : body.rollNo});
            if(findHosteller){
                return res.status(400).json({Mesg : "Hosteller Already Exists With This Roll No."});
            }
            var rollNo = body.rollNo;
            var hostellerName = body.hostellerName;
            var roomNo = body.roomNo;
            var contact = body.contact;
            var email = body.email;
            var password = body.password;
            var hashedPassword = await bcrypt.hash(password,12);
            var messageList = new Array();

            const newHosteller = new Hosteller({
                hostelId : hostelId,
                hostellerId : hostellerId,
                rollNo : rollNo,
                hostellerName : hostellerName,
                roomNo : roomNo,
                contact : contact,
                email : email,
                password : hashedPassword,
                messageList : messageList,
                approved : true,
            });

            //Pushing hostller into Hostel Request
            await newHosteller.save();
            await Hostel.updateOne({hostelId : hostelId} , {$push : {hostellerList : hostellerId}});
            
            return res.status(200).json({Mesg : "Created New Hosteller"});
        }       

    }catch(err){
        console.log(err);
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}

exports.hostellerLogin = async(req ,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        var findHosteller = await Hosteller.findOne({hostellerId : username});
        if(!findHosteller){
            console.log("Hosteller Not Found!!");
            return res.status(400).json({Mesg : "Hosteller Not Found"});
        } 
        if(!findHosteller['approved']){
            console.log('Hosteller is not approved by hostel!!');
            return res.status(300).json({Mesg : "Hosteller is not approved by hostel!!"});
        }
        bcrypt.compare(password , findHosteller['password'],(err, data) => {
            if(err){
                throw new Error(err);
            }else if(data){
                const payload = {
                    hostellerId : findHosteller['hostellerId'],
                    hostellerName : findHosteller['hostellerName']
                };
                const hostellerTokenSecret = process.env.hostellerTokenSecret;
                const hostellerJwtToken =  jwt.sign(payload , hostellerTokenSecret);
                return res.status(200).json({
                    success : true,
                    hostellerJwtToken : 'hostellerBearer ' + hostellerJwtToken
                });
            }else{
                console.log("Incorrect Password!!");
                return res.status(400).json({Mesg : "Incorrect Password!!!"});
            }
        })

    }catch(err){
        console.log("ERROR AT SERVER!!");
        res.json({Mesg : "Some Error At Server!1"}).status(400);
    }
}

exports.hostellerData = async(req, res) => {
    try{
        const hostellerId = req.hostellerId;
        const findHosteller = await Hosteller.findOne({hostellerId : hostellerId});
        if(!findHosteller){
            console.log("Unable to find Data of Student!!")
            return res.status(400).json({Mesg : "Unable to find data of student!!"});
        }
        const hostelId = findHosteller['hostelId'];
        const findHostel = await Hostel.findOne({hostelId : hostelId});
        if(!findHostel){
            console.log("Data of Collage has been Removed!!");
            return res.status(400).json({Mesg : "Data of Collage not Found"});
        }
        const sendData = {
            hostelId : findHosteller['hostelId'],
            hostellerName : findHosteller['hostellerName'],
            contact : findHosteller['contact'],
            email : findHosteller['email'],
            rollNo : findHosteller['rollNo'],
            roomNo : findHosteller['roomNo'],
            collageName : findHostel['collageName'],
            hostelName : findHostel['hostelName'],
            hostelContact : findHostel['contact'],
            hostelEmail : findHostel['email']
        }
        return res.status(200).json({hosteller : sendData});
    }catch(err){
        console.log('ERROR!!');
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}


exports.mesgList = async(req, res) => {
    try{
        var hostellerId = req.hostellerId;
        var findHostller = await Hosteller.findOne({hostellerId : hostellerId});
        if(!findHostller){
            return res.status(400).json({Mesg : "Hosteller Not Found"}).status(206);
        }
        var mesgList = findHostller['messageList'];
        return res.status(200).json({MessageList : mesgList});
    }catch(err){
        console.log('ERROR!!');
        return res.status(500).json({Mesg : "Some Error at Server"});
    }
}
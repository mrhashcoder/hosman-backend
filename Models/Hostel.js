var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hostelSchema = new Schema({
    hostelId : {
        type:String,
        required:true
    },
    hostelName : {
        type:String,
        required:true
    },
    collageName : {
        type : String
    },
    hostellerList : {
        type : [String]
    },
    requestList : {
        type : [String]
    },
    loginUserName : {
        type : String,
        required : true
    },
    loginPassword : {
        type : String,
        required:true
    },
    contact : {
        type : String
    },
    email : {
        type : String
    },
    noticeList : {
        type : [new Schema({
            data : String,
            date : {type : Date , default : Date.now}
        })]
    }
});

module.exports = mongoose.model('Hostel' , hostelSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//hostlerId and rollno will be same
var hostellerSchema = new Schema({
    hostelId : {
        type:String,
        required:true,
    },
    hostellerId : {
        type : String,
        required : true,
        unique : true
    },
    rollNo : {
        type:String,
        required:true
    },
    hostellerName : {
        type:String,
        required : true
    },
    roomNo : {
        type : String,
        required : true
    },
    contact : {
        type : String,
        required:true
    },
    email : {
        type : String,
    },
    password : {
        type : String,
        required:true
    },
    approved : {
        type :Boolean,
        required:true
    },
    messageList : [
        new Schema({
            data : String,
            date : {type : Date , default : Date.now}
        })
    ]
});


module.exports = mongoose.model('Hosteller' , hostellerSchema);
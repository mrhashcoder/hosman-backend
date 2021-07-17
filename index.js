//Importing Variables 
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();


//ImPortant Data Importing from process var
var PORT = process.env.PORT;
var mongoURI = process.env.mongoURI;


//Express App setup 
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    next();
});


//Importing Routes
var indexRoute = require('./Routers/indexRoute');
var hostelRoute = require('./Routers/hostelRoute');
var hostellerRoute = require('./Routers/hostellerRoute');



//Using Routes
app.use(indexRoute); 
app.use(hostelRoute);
app.use(hostellerRoute);


//DataBase Connection
mongoose.connect(mongoURI , {
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {
    console.log('DataBase Connected!!');
}).catch(err => {console.log("ERR : "+ err)});


var server = app.listen(PORT , () => {
    console.log('Server at ' + PORT);
})

































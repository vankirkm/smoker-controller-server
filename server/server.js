
const SerialPort = require('serialport');
const sp = new SerialPort('COM3', 9600);
const Readline = require('@serialport/parser-readline');
const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));
let bodyParser = require('body-parser');



var express = require('express');
var app = express();
var currentTemp;
var currentSetTemp = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/change-set-temp', function(req, res) {
    currentSetTemp = parseFloat(req.body).toFixed(2)
    console.log('received data (set-temp): ' + currentSetTemp);
    sendTempToArduino();
    //sendTempToArduino();
});

app.get('/api/current-temp', function(req, res){
    //console.log('sent data (current-temp): ' + currentTemp);
    res.send(currentTemp + '');
});

app.get('/api/get-set-temp', function(req, res) {
    console.log('sent data (currentSetTemp): ' + currentSetTemp);
    res.send(currentSetTemp + '');
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

parser.on('data', function(data){
    currentTemp = Number(data);
});

function sendTempToArduino(){
    sp.write(currentSetTemp);
    console.log('sending ' + currentSetTemp + ' to arduino');
}
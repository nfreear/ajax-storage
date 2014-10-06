// Test HTTP server - Express.
// http://ericsowell.com/blog/2014/6/17/enough-node-for-building-a-simple-website

var port = 8010;
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/..'));  // + '/public'

console.log('Dir: ' + __dirname);

// CORS middleware
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

//app.use(allowCrossDomain);

//console.log('CORS ok');

app.listen(port, function () {
    console.log('HTTP server listening on... http://127.0.0.1:' + port);
});

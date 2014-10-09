/*!
  Test HTTP server - Express.
  http://ericsowell.com/blog/2014/6/17/enough-node-for-building-a-simple-website
*/

'use strict';

var argv = require('minimist')(process.argv.slice(2));
//console.dir(argv);

var port = argv.port > 799 && argv.port < 9999 ? argv.port : 8010;
var doc_root = __dirname + '/..';

var express = require('express');
var app = express();

app.use(express.static(doc_root));

console.log('Doc root: ' + doc_root);

// CORS middleware
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

//app.use(allowCrossDomain);
//console.log('CORS ok');

app.listen(port, function () {
    console.log('HTTP server listening on... http://127.0.0.1:' + port);
});

process.on('uncaughtException', function (ex) {
    console.log('Error: ' + ex.message);
    if ('EADDRINUSE' === ex.code) {
        console.log(
        '> Perhaps kill a forked Web server on port %s?'.replace('%s', port));
        console.log('> # ps aux | grep node # kill PID');
    }
    process.exit(1);
});

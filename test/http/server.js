/*!
  Test HTTP server - Express.
  http://ericsowell.com/blog/2014/6/17/enough-node-for-building-a-simple-website
*/
'use strict';

var argv = require('minimist')(process.argv.slice(2));
var port = argv.port > 1024 && argv.port < 9999 ? argv.port : 8010;
var doc_root = __dirname + '/../..';
var errors = require('./server-errors')(port);
var express = require('express');
var app = express();

app.use(express.static(doc_root));

console.log('Doc root: ' + doc_root);

app.listen(port, function () {
    console.log('Server listening on... http://127.0.0.1:' + port);
});


module.exports = function (port) {
    'use strict';

    process.on('uncaughtException', function (ex) {
        console.log('Error: ' + ex.message);
        if ('EADDRINUSE' === ex.code) {
            console.log(
            '> Perhaps kill a forked Web server on port %s?'.replace('%s', port));
            console.log('> # ps aux | grep node # kill PID');
        }
        process.exit(1);
    });
};

'use strict';

var app = require('./index');
var http = require('http');
var models = require('./models')


var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8000);
models.sequelize.sync().then(function(){
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
})
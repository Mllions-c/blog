var app = require('../index')
const http = require('http');
const https = require('https');
http.createServer(app.callback()).listen(1992);
https.createServer(app.callback()).listen(1991);
console.log('blog start')
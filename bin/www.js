const app = require('../index')
const http = require('http');
const https = require('https');
const Alphabet = require('../util/console/console.js');
http.createServer(app.callback()).listen(1992);
https.createServer(app.callback()).listen(1991);
console.log(Alphabet('yang', 'stereo'))
process.on('uncaughtException', (error)=> {
    console.log(error, 'uncaughtException')
});
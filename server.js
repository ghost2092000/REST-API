const http = require('http');
const app = require('./app'); //this is from app.js 

const port = process.env.PORT || 3000;

const server = http.createServer(app); // I pass app to the createServer method

server.listen(port);
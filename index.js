const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const router = require('./routes');
const handlers = require('./handlers');

 var unifiedServer = function(req, res) {
    var parsedUrl = url.parse(req.url, true);

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'')

    var method = req.method.toLowerCase();
    var queryString = parsedUrl.query;
    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();

        var data = {
            'path': trimmedPath,
            'method': method,
            'headers' : headers,
            'queryString': queryString,
            'payload' : buffer
        }
  
        var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;

        choosenHandler(data, function(statusCode, payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            var response = JSON.stringify(payload);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(response);
            console.log(statusCode,response);
        });
    });
 };

const httpServer = http.createServer(function (req, res) {
    unifiedServer(req,res);
 });
 httpServer.listen(config.port, function(){
    console.log('Node httpServer started at port ' + config.port + ' in ' + config.name);
 });

var httpsOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
 const httpsServer = https.createServer(httpsOptions,function (req, res) {
    unifiedServer(req,res);
 });
 httpsServer.listen(config.httpsPort, function(){
    console.log('Node httpsServer started at port ' + config.httpsPort + ' in ' + config.name);
 });
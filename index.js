var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

var server = http.createServer(function (req, res) {

    var parsedUrl = url.parse(req.url, true);

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    var queryStringObject = parsedUrl.query;

    var method = req.method.toLowerCase();

    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function (data) {
        buffer += decoder.end();

        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        var data = {
            'trimedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof(statusCode) =='number' ? statusCode : 200;

            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning this response' , statusCode, payloadString);
        });


    });

});

server.listen(config.port, function () {
   console.log("The server is listening on port " + config.port + " in " + config.envName + " mode");
});

// Define the handlers
var handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(406, {'name': 'sampler handler'})
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
}

// Define a request router
var router = {
    'sample': handlers.sample
};

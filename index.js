const http = require('http');
const url = require('url');

const server = http.createServer(function (req, res) {

    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const queryStringObject = parsedUrl.query;

    const method = req.method.toLowerCase();

    const headers = req.headers;

    res.end('Hello  World\n');

    // console.log('Request received on path: '+trimmedPath+
    //             ' with method: '+method +
    //             ' and with these query string parameters' + queryStringObject );

    console.log('Request received with these headers' , headers);
});

server.listen(3000, function () {
   console.log("The server is listening on port 3000 now");
});


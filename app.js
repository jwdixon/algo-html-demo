var http = require('http');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

require('dotenv').config();

http.createServer(function (request, response) {
  var filePath = '.' + request.url;
  if (filePath == './')
    filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  if (filePath.includes('./createSignedBubblegumLimitContract')) {
    var optionsQuerystring = filePath.split('?').pop();

    var options = querystring.parse(optionsQuerystring);

    require('./static/js/limitorder')();

    createSignedBubblegumLimitContract(options['account'])
      .then((data) => {
        response.write(JSON.stringify({
          "contractAddress": data
        }));
        response.statusCode = 200;
        response.end();
      })
      .catch((e) => {
        console.log(e);
        response.write(e.message);
        response.statusCode = e.status;
        response.end();
      });
  } else if (filePath.includes('./executeBubblegumLimitContract')) {
    var optionsQuerystring = filePath.split('?').pop();

    var options = querystring.parse(optionsQuerystring);

    require('./static/js/limitorder')();

    executeBubblegumLimitContract(options['address'])
      .then((data) => {
        response.write(JSON.stringify({
          "txId": data
        }));
        response.statusCode = 200;
        response.end();
      })
      .catch((e) => {
        console.log(e);
        response.write(e.message);
        response.statusCode = e.status;
        response.end();
      });
  } else if (filePath.includes('./createHashTimeLockContract')) {
    var optionsQuerystring = filePath.split('?').pop();

    var options = querystring.parse(optionsQuerystring);

    require('./static/js/hashtimelock')();

    createHashTimeLockContract(options['owner'], options['receiver'])
      .then((data) => {
        response.write(JSON.stringify({
          "txId": data
        }));
        response.statusCode = 200;
        response.end();
      })
      .catch((e) => {
        console.log(e);
        response.write(e.message);
        response.statusCode = e.status;
        response.end();
      });
  } else {
    console.log(`serving ${filePath}...`);

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == 'ENOENT') {
          fs.readFile('./404.html', function (error, content) {
            response.writeHead(200, {
              'Content-Type': contentType
            });
            response.end(content, 'utf-8');
          });
        } else {
          response.writeHead(500);
          response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
          response.end();
        }
      } else {
        response.writeHead(200, {
          'Content-Type': contentType
        });
        response.end(content, 'utf-8');
      }
    });
  }

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');

function collectRequestData(request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (request.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}
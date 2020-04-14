import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { StringDecoder } from 'string_decoder';
import handlers from './api/handlers';

const port = process.env.PORT || 1000;

const server = http.createServer((req, res) => {
  const timer = new Date();
  const { pathname } = url.parse(req.url, true);
  const decoder = new StringDecoder('utf-8');
  const request = {
    path: pathname.replace(/^\/+|\/+$/g, ''),
    method: req.method.toUpperCase(),
    body: ''
  };

  const sendResponse = (code, payload, type = 'application/json') => {
    let diff = new Date() - timer;
    diff = diff.toString().length === 1 ? `0${diff}` : diff;
    const log = (`${request.method}\t/${request.path}\t${code}\t${diff}ms\n`);
    fs.appendFile(path.resolve(__dirname, 'logs.txt'), log, 'utf8', () => {
      res.setHeader('Content-Type', type);
      res.writeHead(code);
      res.end(type === 'application/json' ? JSON.stringify(payload) : payload);
    });
  };

  req.on('data', (data) => {
    request.body += decoder.write(data);
  });
  req.on('end', (data) => {
    request.body += decoder.end(data);
    try {
      request.body = JSON.parse(request.body);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('ERROR', e);
    }
    switch (request.path) {
      case 'api/v1/on-covid-19':
        return request.method === 'GET'
          ? handlers.welcome(request, sendResponse)
          : handlers.json(request, sendResponse);
      case 'api/v1/on-covid-19/json':
        return handlers.json(request, sendResponse);
      case 'api/v1/on-covid-19/logs':
        return handlers.logs(request, sendResponse);
      case 'api/v1/on-covid-19/xml':
        return handlers.xml(request, (code, payload) => sendResponse(code, payload, 'application/xml'));
      default:
        return sendResponse(404, {
          success: false,
          message: `cannot ${request.method} ${request.path}`
        });
    }
  });
});

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Listening on port ${port}`));

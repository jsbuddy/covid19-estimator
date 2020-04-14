import fs from 'fs';
import path from 'path';
import covid19ImpactEstimator from '../estimator';
import { OBJtoXML } from '../utils';

const handlers = {
  welcome: (request, cb) => cb(200, 'Welcome to simple-covid19-estimator api'),
  json: (request, cb) => {
    if (request.method === 'GET') return cb(405, 'Method not allowed');
    const data = {
      ...covid19ImpactEstimator(request.body),
      data: request.body
    };
    return cb(200, { ...data });
  },
  xml: (request, cb) => {
    if (request.method === 'GET') return cb(405, 'Method not allowed');
    const data = OBJtoXML({
      ...covid19ImpactEstimator(request.body),
      data: request.body
    });
    return cb(200, data, 'application/xml');
  },
  logs: (request, cb) => {
    if (!request.method.match(/GET|POST/gi)) return cb(405, 'Method not allowed');
    return fs.readFile(path.resolve(__dirname, '../logs.txt'), 'utf-8', (err, file) => {
      if (!err) {
        if (file) {
          cb(200, file, 'text/plain');
        } else {
          cb(404, 'No logs');
        }
      } else {
        cb(404, 'No logs');
      }
    });
  }
};

export default handlers;

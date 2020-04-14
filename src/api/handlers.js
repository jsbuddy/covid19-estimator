import fs from 'fs';
import path from 'path';
import covid19ImpactEstimator from '../estimator';
import { OBJtoXML } from '../utils';

const handlers = {
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
    return cb(200, data);
  },
  logs: (request, cb) => {
    if (request.method === 'POST') return cb(405, 'Method not allowed');
    return fs.readFile(path.resolve(__dirname, '../logs.txt'), { encoding: 'utf-8' }, (err, file) => {
      if (!err) {
        cb(200, file.toString()
          .trim(), 'text/plain');
      } else {
        cb(200, 'No logs found!', 'text/plain');
      }
    });
  }
};

export default handlers;

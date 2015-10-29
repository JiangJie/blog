'use strict';

const request = require('./lib').request;

request({
    url: 'http://nodejs.org/dist/v4.2.1/node-v4.2.1.tar.gz'
});
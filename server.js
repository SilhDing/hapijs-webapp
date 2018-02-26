'use strict';

const Hapi = require('hapi');
const path = require('path');

// please note this is a hapi with version v17!
const server = new Hapi.Server({ 
    port: 9000, 
    host: 'localhost' });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
        return h.response('Hello, Yihang! This is a web App based on Hapi!')
    }
});

async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
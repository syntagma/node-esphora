#!/usr/bin/env node
"use strict";
/**
 * Created by sebastianbromberg on 10/2/15.
 */

//var restify = require('restify');
var winston = require('winston');
//var bunyan = require('bunyan');
var save = require('save');
//var userSave = save('user');
var configuration = require ("./bootstrapping/configuration");

var server = new configuration.ServerBuilder();
//server.initializeDatabase();
server.createServer();
server.configureMailServer();
server.buildPreRequisites();
server.buildAditionalConfiguration();
//server.buildAuthApi();
server.buildRoutes();
//server.audit();
server = server.getInstance();

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({colorize: true, json: false})
    ]
});


// Whatever Winston logger setup your application wants.
/*
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({colorize: true, json: false})
    ]
});


// Pass a Bunyan logger to restify that shims to our winston Logger.
var shim = bunyan.createLogger({
    name: 'node-esphora',
    streams: [{
        level: 'info',
        name: 'wagaduu-audit',
        stream: process.stdout
    }]
});

var server = restify.createServer({
    name: 'node-esphora',
    version: '1.0.0',
    log: shim
});
server
    .use(restify.fullResponse())
    .use(restify.bodyParser());
*/


server.listen(3000, function () {
    logger.info('%s listening at %s', server.name, server.url)
});
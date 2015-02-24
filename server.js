#!/usr/bin/env node
"use strict";
/**
 * Created by sebastianbromberg on 10/2/15.
 */

//var restify = require('restify');
var winston = require('winston');
//var bunyan = require('bunyan');
//var save = require('save');
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
server.on('uncaughtException', function (req, res, route, err) {
    logger.error('uncaughtException', err.stack);
});

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({colorize: true, json: false})
    ]
});





server.listen(3000, function () {
    logger.info('%s listening at %s', server.name, server.url)
});
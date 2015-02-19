"use strict";

// infrastructure
var restify = require('restify');
//var express = require('express');
var bunyan = require('bunyan');
var fs = require('fs');
var path = require("path");
//var passport = require('passport');
//var mongoose = require('mongoose');
//var URIjs = require('URIjs');

// specific configurators
//var mongooseConfigurator = require('./configurators/mongooseConfigurator');
//var MongoStore = require('connect-mongostore')(express);

var AuthorizationConfigurator = require('./configurators/authorizationConfigurator');
//var logger = require('./configurators/logConfigurator').logger;
var logger = require('winston');
//routes impl
var routes = require('../routes/');
var routesResolver = require('../routes/routesResolver');

// configurable data
//var appData = require('../config/appData');

exports.ServerBuilder = function () {
    var self = this;
    var server;

    var CORS_AC_MAX_AGE = 172800;
    var HTTP_RESPONSE_CODE_OK = 200;

    self.initializeDatabase = function () {
        //mongooseConfigurator.connect();
    };

    self.createServer = function () {

        //var logInstance = logger;//(new LogConfigurator()).getInstance();
        //logInstance.info("Este es winston?");
        server = restify.createServer({
//                log: logInstance,
                name: "node-esphora",
                version: "0.0.1",
                log: bunyan.createLogger({
                    level: 'info',
                    name: 'node-esphora',
                    stream: process.stdout
                })
            }
            , function (req, res) {
                var domain = require('domain');
                var d = domain.create();
                d.on('error', function (er) {
                    console.error('error', er.stack);
                    logger.error('error', er.stack);

                    // Note: we're in dangerous territory!
                    // By definition, something unexpected occurred,
                    // which we probably didn't want.
                    // Anything can happen now!  Be very careful!

                    try {
                        // make sure we close down within 30 seconds
                        var killtimer = setTimeout(function () {
                            process.exit(1);
                        }, 30000);
                        // But don't keep the process open just for that!
                        killtimer.unref();

                        // stop taking new requests.
                        server.close();

                        // Let the master know we're dead.  This will trigger a
                        // 'disconnect' in the cluster master, and then it will fork
                        // a new worker.
                        //cluster.worker.disconnect();

                        // try to send an error to the request that triggered the problem
                        res.statusCode = 500;
                        res.setHeader('content-type', 'text/plain');
                        res.end('Oops, there was a problem!\n');
                    } catch (er2) {
                        // oh well, not much we can do at this point.
                        logger.error('Error sending 500!', er2.stack);
                    }
                });

                // Because req and res were created before this domain existed,
                // we need to explicitly add them.
                // See the explanation of implicit vs explicit binding below.
                d.add(req);
                d.add(res);

                // Now run the handler function in the domain.
                d.run(function () {
                        handleRequest(req, res);
                    }
                );
            });
        addEventHandlers();
    };

    /*
    self.audit = function () {
        server.on('after', restify.auditLogger({
            body: true,
            log: bunyan.createLogger({
                level: 'info',
                name: 'node-esphora-audit',
                stream: process.stdout
            })
        }));
    };
    */

    self.buildPreRequisites = function () {
        enableCORSWithCredentials();
        ensureDontDropDataOnUploads();
        cleanUpSloppyPaths();
        handleAnnoyingUserAgents();
        setPerRequestBunyanLogger();
    };

    self.buildAditionalConfiguration = function () {
        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.dateParser());
        server.use(restify.authorizationParser());
        server.use(restify.queryParser());
        server.use(restify.gzipResponse());
        server.use(restify.bodyParser());
    };

    self.buildStaticRoutes = function () {
        //todos los requests que no empiecen por /api los saca de public...
        routeStaticContentTo(/^\/((?!api\/).)*$/, './public');
    };

    self.buildRoutes = function () {
        buildApi();
    };

    self.buildAuthApi = function () {
        buildAuthentificationApi();
        buildAuthorizationApi();
    };

    self.getInstance = function () {
        return server;
    };

    self.configureMailServer = function () {
        //server.use(emailConfigurator.wagaMail(server));
    };

    // PRIVATE METHODS
    function buildAuthorizationApi() {
        var authorizationConfigurator = new AuthorizationConfigurator({
            'protocol': appData.name,
            'sessionType': "user",
            'sessionLifetime': appData.sessionLifetime,
            'port': appData.port,
            'publicApi': /^\/api\/public/,
            'panelApi': /^\/api\/panel/,
            'adminApi': /^\/api\/admin/
        });

        server.use(authorizationConfigurator.initialize());

        server.use(authorizationConfigurator.session());
        server.authorization = authorizationConfigurator;

    }

    function buildAuthentificationApi() {
        var TTL = 60 * 60 * 1000 * 24 * 30;

        server.use(function (req, res, next) {
            req.originalUrl = req.url;
            next();
        });
        //server.use(express.cookieParser());
        /*server.use(express.session({
            secret: 'thisismysupersecret',
            cookie: {maxAge: TTL, domain: extractDomain(appData.server), httpOnly: false},
            store: new MongoStore(
                {
                    db: mongoose.connection.db
                },
                function (error) {
                    if (error) {
                        return console.error('Failed connecting mongostore for storing session data. %s', error.stack);
                    }
                    return console.log('Connected mongostore for storing session data');
                }
            )
        }));

        */

        //server.use(passport.initialize());
        //server.use(passport.session());

        //require('./configurators/authenticationHandlers/facebookAuthenticationHandler')(server);
        //require('./configurators/authenticationHandlers/localAuthenticationHandler')(server);
    }

    function enableCORSWithCredentials() {
        server.pre(
            function (req, res, next) {
                res.header('Access-Control-Allow-Origin', req.headers.origin);
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.header('Access-Control-Allow-Credentials', true);
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
                res.header('Access-Control-Max-Age', CORS_AC_MAX_AGE);

                // intercept OPTIONS method
                if ('OPTIONS' == req.method) {
                    res.send(HTTP_RESPONSE_CODE_OK);
                }
                else {
                    next();
                }
            });
    }

    //TODO: Check what it does
    function ensureDontDropDataOnUploads() {
        server.pre(restify.pre.pause());
    }

    //TODO: Check what it does
    function cleanUpSloppyPaths() {
        server.pre(restify.pre.sanitizePath());
    }

    //TODO: Check what it does
    function handleAnnoyingUserAgents() {
        server.pre(restify.pre.userAgentConnection());
    }

    //TODO: Check what it does
    function setPerRequestBunyanLogger() {
        server.use(restify.requestLogger());
    }

    function allowRequestsPerSecondAndBurst(burst, rate, ip) {
        server.use(restify.throttle({
            burst: burst,
            rate: rate,
            ip: ip
        }));
    }

    function buildApi() {
        var rootElement = routesResolver.routesResolver(server);
        var routesArray = routes.getRoutes();

        for (var i in routesArray) {
            rootElement.setRoute(routesArray[i]);
        }
        publishApi(routesArray);
    }

    function publishApi(routesArray) {
        server.get('/api/list', function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            res.send(routesArray);
        });
    }

    function addEventHandlers() {
        server.on('close', function () {
            //closeSMTPTransport();
            //closeDBConnection();
        });

         server.on('error', function (err) {
         logger.info("******** Caught flash policy server socket error: ");
         logger.info(err.stack);
         });
    }


    function handleRequest(req, res) {
        console.log(" handleRequest ");
        switch (req.url) {
            case '/error':
                // We do some async stuff, and then...
                /*
                 setTimeout(function() {
                 // Whoops!
                 flerb.bark();
                 }); */
                break;
            default:
                res.end('ok');
        }
    }

    function closeSMTPTransport() {
        console.log("closing SMTP connection");
        server.smtpTransport.close();
    }

    function closeDBConnection() {
        logger.info("closing DB connection");
//        console.log("closing DB connection");
        mongooseConfigurator.closeConnection();
    }

    /*
    function extractDomain(url) {

        if (url) {
            if (URIjs(url).domain() != "localhost") {

                return "." +
                    URIjs(url).domain();


            }
        }
        return undefined;
    }
    */

};
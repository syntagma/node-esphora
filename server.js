#!/usr/bin/env node

/**
 * Module Dependencies
 */
//if ( require( "config" ).get( "newrelic.enabled" ) ) {
//    console.log( "NewRelic is enabled" );
//    require( "newrelic" );
//}

 
let config = require( "config" ),
    restify = require( "restify" ),
    bunyanWinston = require( "bunyan-winston-adapter" ),
    log = require( "./bootstrapping/log.js" ),
    mongoose = require( "./bootstrapping/mongoose" ),
    passport = require( "./bootstrapping/passport" ),
    rsmq = require( "./bootstrapping/rsmq" ),
    rootRouter = require( "./bootstrapping/routes" ),
    cluster = require( "cluster" ),
    os = require( "os" );
    /* Initialize Server */


if ( cluster.isMaster && config.get( "app.cluster" ) ) {
    let numWorkers = os.cpus().length;

    log.info( "Master cluster setting up " + numWorkers + " workers..." );

    for ( let i = 0; i < numWorkers; i++ ) {
        cluster.fork();
    }

    cluster.on( "online", ( worker ) => {
        "use strict";
        log.info( "Worker " + worker.process.pid + " is online" );
    } );

    cluster.on( "exit", ( worker, code, signal ) => {
        "use strict";
        log.info( "Worker " + worker.process.pid + " died with code: " + code + ", and signal: " + signal );
        log.info( "Starting a new worker" );
        cluster.fork();
    } );
} else {
    let server = restify.createServer( {
        "name": config.get( "app.name" ),
        "version": config.get( "app.version" ),
        "log": bunyanWinston.createAdapter( log )
    } );


    /**
     * Middleware
     */
    server.use( restify.jsonBodyParser( { "mapParams": true } ) );
    server.use( restify.acceptParser( server.acceptable ) );
    server.use( restify.queryParser( { "mapParams": true } ) );
    server.use( restify.fullResponse() );
    server.use( restify.authorizationParser() );
    server.use( passport.initialize() );
    server.use(
        ( req, res, next ) => {
            "use strict";
            res.header( "Access-Control-Allow-Origin", "*" );
            res.header( "Access-Control-Allow-Headers", "X-Requested-With" );
            return next();
        }
      );

    /**
     * Lift Server, Connect to DB & Bind Routes
     */
    server.listen( config.get( "app.port" ), () => {
        "use strict";

        log.info(
                "%s v%s ready to accept connections on port %s in %s environment.",
                server.name,
                config.get( "app.version" ),
                config.get( "app.port" ),
                config.get( "app.env" )
        );
        log.info( "Process " + process.pid + " is listening to all incoming requests" );


        // mongoose.setApp();

        // if ( config.get( "rsmq.enable" ) ) {
        //    global.rsmq = rsmq.startApp();
        // }

        rootRouter.applyRoutes( server );
    
    } );
//    server.all('/*', function(req, res) {res.send('process ' + process.pid + ' says hello!').end();})

}

const winston = require( "winston" ),
    Logger = require( "le_node" ),
    config = require( "config" );

let transports = [
    new winston.transports.Console( {
        "level": config.get( "log.level" ),
        "timestamp": ( ) => {
            "use strict";
            return new Date().toString();
        },
        "json": false,
        "prettyPrint": true,
        "colorize": true
    } ) ];

if ( config.get( "logEntries.enable" ) ) {
    transports.push( new winston.transports.Logentries( {
        "token": config.get( "logEntries.token" ),
        "level": config.get( "logEntries.level" ),
        "timestamp": ( ) => {
            "use strict";
            return new Date().toString();
        },
        "json": false,
        "prettyPrint": true,
        "colorize": true
    } ) );
}
/**
 * Logging
 */
global.log = new winston.Logger( { "transports": transports } );

module.exports = log;

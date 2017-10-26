/*
let mongoose = require( "mongoose" ),
    config = require( "config" );

module.exports.setApp = function() {
    "use strict";
    mongoose.connection.on( "error", ( err ) => {
        log.error( "Mongoose default connection error: ", err );
        process.exit( 1 );
    } );

    mongoose.connection.on( "open", ( err ) => {
        if ( err ) {
            log.error( "Mongoose default connection error: ", err );
            process.exit( 1 );
        }
    } );

    mongoose.set( "debug", config.get( "mongo.debug" ) );

    mongoose.connect( config.get( "mongo.uri" ), { "useMongoClient": config.get( "mongo.useMongoClient" ) } );
    mongoose.Promise = global.Promise;
    
};
*/
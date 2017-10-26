/**
 * Created by sebastianbromberg on 20/2/15.
 */
let util = require( "util" ),
    spawn = require( "child_process" ).spawn,
    Promise = require( "promise" );

// Expose methods.
// exports.sign = sign;

/**
 * Sign a file.
 *
 * @param {object} options Options
 * @param {stream.Readable} options.content Content stream
 * @param {string} options.key Key path
 * @param {string} options.cert Cert path
 * @param {string} [options.password] Key password
 * @param {function} [cb] Optional callback
 * @returns {object} result Result
 * @returns {string} result.pem Pem signature
 * @returns {string} result.der Der signature
 * @returns {string} result.stdout Strict stdout
 * @returns {string} result.stderr Strict stderr
 * @returns {ChildProcess} result.child Child process
 */

exports.sign = ( options, cb ) => {
    "use strict";
    log.debug( "sign ------" );
    return new Promise( ( resolve, reject ) => {
        let args, child, der, command;

        options = options || {};

        if ( !options.content ) {
            throw new Error( "Invalid content." );
        }

        if ( !options.key ) {
            throw new Error( "Invalid key." );
        }

        if ( !options.cert ) {
            throw new Error( "Invalid certificate." );
        }

        command = util.format(
            "openssl smime -sign -binary -signer %s -inkey %s -outform DER -nodetach",
            options.cert,
            options.key
        );

        if ( options.password ) {
            command += util.format( " -passin pass:%s", options.password );
        }
        log.debug( command );
        
        args = command.split( " " );
        log.debug( args );
        child = spawn( args[ 0 ], args.splice( 1 ) );
        der = [];

        child.stdout.on( "data", ( chunk ) => {
            der.push( chunk );
        } );

        child.on( "close", ( code ) => {
            if ( code !== 0 ) {
                reject( new Error( "Process failed. Code: " + code ) );
            } else {
                resolve( {
                    "child": child,
                    "der": Buffer.concat( der )
                } );
            }
        } );

        options.content.pipe( child.stdin );
    } )
        .nodeify( cb );
};

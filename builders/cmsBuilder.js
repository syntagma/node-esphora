/**
 * Created by sebastianbromberg on 11/2/15.
 */
let ticketFactory = require( "../factories/ticketFactory" ),
    path = require( "path" ),
    config = require( "config" ),
    signHelper = require( "../helpers/signHelper" ),
    Readable = require( "stream" ).Readable,
    soap = require( "soap" ),
    parseString = require( "xml2js" ).parseString;
    

exports.buildTicket = ( companyId, callback ) => {
    "use strict";

    log.debug( "buildTicket" );
    
    let self = this,
        ticket = {},
        cmsMessage,
        createTicket = ( callback ) => {
            log.debug( "createTicket" );
            ticket = ticketFactory.createTicket( "wsfe" );
            log.debug( ticket );
            callback();
        },
        signTicket = ( callback ) => {
            log.debug( "signTicket --------------- " );
            let s = new Readable();

            s.push( ticket.xml );    // the string you want
            s.push( null );      // indicates end-of-file basically - the end of the stream

            signHelper.sign( {
                "content": s, //fs.createReadStream(path.join(__dirname, "TRA.xml")),
                "key": path.join( __dirname, "../" + config.get( "certs.path" ) + companyId + ".privada" ),
                "cert": path.join( __dirname, "../" + config.get( "certs.path" ) + companyId + ".crt" ),
                "password": companyId
            } ).catch( ( err ) => {
                log.error( "Error signing: " + err.stack );
                log.debug( "signTicket ++++++++++++" );
                callback( err );
            } ).then( ( result ) => {
                cmsMessage = result.der;

                log.debug( "signTicket ++++++++++++" );
                callback( null );
            } );
        },
        encodeCms = () => {
            cmsMessage = Buffer( cmsMessage ).toString( "base64" );
        },
        invokeAfipWSAA = ( callback ) => {
            log.debug( "invokeAfipWSAA --------------- " );


            let url = 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl';

            soap.createClient( url, ( err, client ) => {
                let args = [ { "in0": cmsMessage } ];

                client.loginCms( args, ( err, result ) => {

                    if ( err ) {
                        log.error( "loginCms error returned: " + err );
                        //var cleanedErr = err.replace("\ufeff", "");
                        parseString( err.body, ( err2, parsedErr ) => {
                            if ( err2 ) {
                                return callback( "parseString: Error parsing string. Error: " + err2 );
                            }

                            let afipError = {
                                // "code": parsedErr[ "soapenv:Envelope" ][" soapenv:Body" ][ 0 ][ "soapenv:Fault" ][ 0 ].faultcode[ 0 ][ "_" ],
                                "message": parsedErr[ "soapenv:Envelope" ][ "soapenv:Body" ][ 0 ][ "soapenv:Fault" ][ 0 ].faultstring[ 0 ]
                            };

                            callback( afipError.message );
                            log.debug( "invokeAfipWSAA ++++++++++++++ " );
                        });
                        return;
                    }

                    parseString( result.loginCmsReturn, ( err2, parsed ) => {
                        console.dir( parsed );
                        callback( err2, parsed.loginTicketResponse.credentials );
                        log.debug( "invokeAfipWSAA ++++++++++++++ " );
                    } );
                } );
            } );

        },
        mainStream = ( ) => {
            log.debug( "Start Building CMS ... " );

            createTicket( ( ) => {
                signTicket( ( err ) => {
                    if ( err ) {
                        callback ( err );
                        return;
                    }
                    encodeCms();
                    invokeAfipWSAA( ( err2, credentials ) => {
                        if ( err2 ){
                            return callback ( err2 );
                        }
                        console.dir( credentials );
                        ticket.company = companyId;
                        ticket.sign = credentials[ 0 ].sign;
                        ticket.token = credentials[ 0 ].token;
                        callback( err2, ticket );
                    } );

                } );
            } );

        };
    
    mainStream( );
};

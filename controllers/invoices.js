/**
 * Created by sebastianbromberg on 10/2/15.
 */
let // logger = require( "winston" ),
    tickets = require( "./tickets" ),
    soap = require( "soap" ),
    parseString = require( "xml2js" ).parseString;

exports.compUltimoAutorizado = ( companyId, pos, type, callback ) => {
    "use strict";

    log.debug( "findInvoice ----" );
    tickets.findOrCreateTicket( companyId, ( err2, ticket ) => {
        if ( err2 ) {
            log.error( err2 );
            return callback( "Error trying to find or create Ticket: " + err );
        }

        createClientAfipWSFEv1( ( err3, client ) => {
            if ( err3 ) {
                log.error( err3 );
                return callback( "Se ha producido un error al crear createClientAfipWSFEv1" );
            }

            let args = {
                "Auth": {
                    "Token": ticket.token,
                    "Sign": ticket.sign,
                    "Cuit": ticket.company
                },
                "CbteTipo": type,
                "PtoVta": pos
            };

            client.FECompUltimoAutorizado( args, ( err4, result ) => {
                if ( err4 ) {
                    log.error( "FECompConsultar error returned" );
                    parseString( err.body, ( err5, parsedErr ) => {
                        if ( err5 ) {
                            log.error( "parseString: Error parsing string. Error: " + err5 );
                            log.debug( "findInvoice ++++" );
                            return callback( "parseString: Error parsing string. Error: " + err5 );
                        }
                        log.debug( "FECompConsultar parsed" );
                        log.debug( "findInvoice ++++" );
                        return callback( err5, parsedErr );
                    } );
                }

                log.debug( "FECompConsultar returned" );
                log.debug( "Soap message: " + client.lastRequest );
                console.dir( result.FECompUltimoAutorizadoResult );
                if ( result.FECompUltimoAutorizadoResult.Errors ) {
                    log.debug( "findInvoice ERRORS" );
                    log.error( result.FECompUltimoAutorizadoResult.Errors.Err[ 0 ].Msg );
                    log.debug( "findInvoice ++++" );
                    return callback( result.FECompUltimoAutorizadoResult.Errors.Err[ 0 ].Msg );

                }

                log.debug( "findInvoice ++++" );
                return callback( null, result.FECompUltimoAutorizadoResult );
            } );
        } );
    } );
};
    

exports.compConsultar = ( companyId, pos, type, number, callback ) => {
    "use strict";

    log.debug( "findInvoice ----" );
    tickets.findOrCreateTicket( companyId, ( err2, ticket ) => {
        if ( err2 ) {
            log.error( err2 );
            return callback( "Error trying to find or create Ticket: " + err );
        }

        createClientAfipWSFEv1( ( err3, client ) => {
            if ( err3 ) {
                log.error( err3 );
                return callback( "Se ha producido un error al crear createClientAfipWSFEv1" );
            }

            let args = {
                "Auth": {
                    "Token": ticket.token,
                    "Sign": ticket.sign,
                    "Cuit": ticket.company
                },
                "FeCompConsReq": {
                    "CbteTipo": type,
                    "CbteNro": number,
                    "PtoVta": pos
                }
            };

            client.FECompConsultar( args, ( err4, result ) => {
                if ( err4 ) {
                    log.error( "FECompConsultar error returned" );
                    parseString( err.body, ( err5, parsedErr ) => {
                        if ( err5 ) {
                            log.error( "parseString: Error parsing string. Error: " + err5 );
                            log.debug( "findInvoice ++++" );
                            return callback( "parseString: Error parsing string. Error: " + err5 );
                        }
                        log.debug( "FECompConsultar parsed" );
                        log.debug( "findInvoice ++++" );
                        return callback( err5, parsedErr );
                    } );
                }

                log.debug( "FECompConsultar returned" );
                log.debug( "Soap message: " + client.lastRequest );

                if ( result.FECompConsultarResult.Errors ) {
                    log.debug( "findInvoice ERRORS" );
                    log.error( result.FECompConsultarResult.Errors.Err[ 0 ].Msg );
                    log.debug( "findInvoice ++++" );
                    return callback( result.FECompConsultarResult.Errors.Err[ 0 ].Msg );

                }

                log.debug( "findInvoice ++++" );
                return callback( null, result.FECompConsultarResult.ResultGet );
            } );
        } );
    } );
};

exports.dummy = ( callback ) => {
    "use strict";

    log.debug( "dummy ----" );

    createClientAfipWSFEv1( ( err3, client ) => {
        if ( err3 ) {
            log.error( err3 );
            return callback( "Se ha producido un error al crear createClientAfipWSFEv1" );
        }

        let args = {
        };

        client.FEDummy( args, ( err4, result ) => {
            if ( err4 ) {
                log.error( "FEDummy error returned" );
                parseString( err.body, ( err5, parsedErr ) => {
                    if ( err5 ) {
                        log.error( "parseString: Error parsing string. Error: " + err5 );
                        log.debug( "FEDummy ++++" );
                        return callback( "parseString: Error parsing string. Error: " + err5 );
                    }
                    log.debug( "FEDummy parsed" );
                    log.debug( "FEDummy ++++" );
                    return callback( err5, parsedErr );
                } );
            }

            log.debug( "FEDummy returned" );
            log.debug( "Soap message: " + client.lastRequest );

            if ( result.FEDummyResult.Errors ) {
                log.debug( "FEDummy ERRORS" );
                log.error( result.FEDummyResult.Errors.Err[ 0 ].Msg );
                log.debug( "FEDummy ++++" );
                return callback( result.FEDummyResult.Errors.Err[ 0 ].Msg );

            }

            log.debug( "FEDummy ++++" );
            return callback( null, result.FEDummyResult );
        } );
    } );
};


createClientAfipWSFEv1 = ( callback ) => {
    "use strict";
    log.debug( "invokeAfipWSFEv1 --------------- " );


    const url = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL";

    soap.createClient( url, ( err, client ) => {
        callback( err, client );
    } );
    log.debug( "invokeAfipWSFEv1 ++++++++++++++ " );

};

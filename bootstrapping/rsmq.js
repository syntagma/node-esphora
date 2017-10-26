let config = require( "config" );

if ( config.get( "rsmq.enable" ) ) {

    let mailSenderService = require( "../services/mailSenderService" ),
        RedisSMQ = require( "rsmq" ),
        RSMQWorker = require( "rsmq-worker" ),
        rsmq = new RedisSMQ( {
            "host": config.get( "rsmq.host" ),
            "port": config.get( "rsmq.port" ),
            "ns": config.get( "rsmq.ns" ) } ),
        worker = new RSMQWorker( "messages", {
            "rsmq": rsmq,
            "autostart": true } );
        
    module.exports.startApp = function() {
        "use strict";
        rsmq.listQueues( ( err, queues ) => {
            if ( err ) {
                log.error( err );
                return;
            }
            log.info( "Active queues: ", queues.join( "," ) );

            if ( !queues.includes( "messages" ) ) {
                rsmq.createQueue( { "qname": "messages" }, ( err2, resp ) => {
                    if ( err2 ) {
                        log.error( "Redis default connection error: ", err2 );
                        process.exit( 1 );
                    }

                    if ( resp === 1 ) {
                        log.debug( "queue created" );

                        rsmq.sendMessage( { "qname": "messages", "message": JSON.stringify( { "texto": "pepe" } ) }, ( err3, resp2 ) => {
                            if ( resp ) {
                                log.debug( "Message sent. ID: ", resp2 );
                            }
                        } );
                    }
                } );
            } /*else {
                rsmq.sendMessage( { "qname": "messages", "message": JSON.stringify( { "texto": "pepe", "type":"" } ) }, ( err2, resp ) => {
                    log.info( err );
                    if ( resp ) {
                        log.info( "Message sent. ID: ", resp );
                    }
                } );
            }
    */
        } );


        worker.on( "message", ( msg, next, id ) => {
            // process your message
            log.debug( "Message id : " + id );
            log.debug( msg );
            
            mailSenderService.sendNow( JSON.parse( msg ).type, JSON.parse( msg ).data );
            worker.del( id );
            next( );
        } );

        // optional error listeners
        worker.on( "error", ( err, msg ) => {
            log.error( "ERROR", err, msg.id );
        } );

        worker.on( "exceeded", ( msg ) => {
            log.warn( "EXCEEDED", msg.id );
        } );
        worker.on( "timeout", ( msg ) => {
            log.warn( "TIMEOUT", msg.id, msg.rc );
        } );

        return rsmq;
    };
}

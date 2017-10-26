/**
 * Created by sebastianbromberg on 10/2/15.
 */

let moment = require( "moment" );
        randomIntInc = ( low, high ) => {
            "use strict";
            return Math.floor( Math.random() * ( high - low + 1 ) + low );
        };

    moment.locale( "es" ),
    
exports.createTicket = ( service ) => {
    "use strict";
    
    log.debug( "createTicket ------" );

    /** ***** Ticket Example:
     *
     *
     *
     * <loginTicketRequest version="1.0">
     *     <header>
     *         <source>C=AR, O=Ritenere SA, SERIALNUMBER=CUIT 30700627825, CN=fintest</source>
     *         <destination>CN=wsaahomo, O=AFIP, C=AR, SERIALNUMBER=CUIT 33693450239</destination>
     *         <uniqueId>1423847620</uniqueId>
     *         <generationTime>2015-02-21T14:13:40.332-03:00</generationTime>
     *         <expirationTime>2015-02-21T15:13:40.332-03:00</expirationTime>
     *     </header>
     *     <service>wsfe</service>
     *     </loginTicketRequest>
     *
     *
     */

    let ticket = {
            "gentime": moment().subtract( 10, "minute" ).format(),
            "exptime": moment().add( 60, "minute" ).format(),
            "uniqueId": randomIntInc( 1, 999999999 )
        },
        loginTicketRequestXml = "";


    log.debug( "uniqueId: " + ticket.uniqueId );

    loginTicketRequestXml = '<?xml version="1.0" encoding="UTF-8"?><loginTicketRequest><header><uniqueId>' + ticket.uniqueId + '</uniqueId><generationTime>' + ticket.gentime + '</generationTime><expirationTime>' + ticket.exptime + '</expirationTime></header><service>wsfe</service></loginTicketRequest>';

    ticket.xml = loginTicketRequestXml;
    log.debug( "createTicket +++++" );

    return ( ticket );
};


/**
 * Created by sebastianbromberg on 10/2/15.
 */
"use strict";

var logger = require("winston");

exports.createTicket = function createTicket(signerDN, dstDN, service, TicketTime) {
    logger.info("createTicket ------");

    /******* Ticket Example:
     *
     *
     *
     * <loginTicketRequest version="1.0">
     *     <header>
     *         <source>C=AR, O=Ritenere SA, SERIALNUMBER=CUIT 30700627825, CN=fintest</source>
     *         <destination>CN=wsaahomo, O=AFIP, C=AR, SERIALNUMBER=CUIT 33693450239</destination>
     *         <uniqueId>1423847620</uniqueId>
     *         <generationTime>2015-02-13T14:13:40.332-03:00</generationTime>
     *         <expirationTime>2015-02-13T15:13:40.332-03:00</expirationTime>
     *     </header>
     *     <service>wsfe</service>
     *     </loginTicketRequest>
     *
     *
     */

    var dateNow = new Date();
    var gentime = dateNow.toISOString();
    var exptime = dateNow.toISOString();
    var uniqueId = dateNow.getTime();

    //exptime.setTime() .setTime());

    //String date = "2009-07-16T19:20:30-05:00";
    //String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSz";
    //SimpleDateFormat sdf = new SimpleDateFormat(pattern);


    //XMLGregorianCalendarImpl XMLGenTime = new XMLGregorianCalendarImpl(gentime);

    //XMLGregorianCalendarImpl XMLExpTime = new XMLGregorianCalendarImpl(exptime);
    logger.info("Fecha: " + dateNow.getTime());

    var loginTicketRequestXml = ' <?xml version="1.0" encoding="UTF-8"?> '
            + '<loginTicketRequest> '
            + '   <header>                                                                                    '
            + '   <uniqueId>1423847</uniqueId>                                      '
            + '    <generationTime>2015-02-13T14:13:40.332-03:00</generationTime>     '
            + '<expirationTime>2015-02-13T15:13:40.332-03:00</expirationTime> '
            + ' </header>               '
            + ' <service>wsfe</service>'
            + '</loginTicketRequest>'

    /*         + ' <loginTicketRequest version="1.0"> '
     + " <header> "
     + " <uniqueId> " + uniqueId
     + " </uniqueId> "
     + " <generationTime> "
     + gentime
     + " </generationTime> "
     + " <expirationTime> "
     + exptime
     + " </expirationTime> "
     + " </header> "
     + " <service> "
     + service
     + " </service> "
     + " </loginTicketRequest> "*/;

    logger.info("Ticket: " + loginTicketRequestXml);
    logger.info("createTicket +++++");

    return (loginTicketRequestXml);
};

/**
 * Created by sebastianbromberg on 10/2/15.
 */
var logger = require('winston');
var tickets = require('./tickets');

exports.findInvoice = function findInvoice(companyId, pos, type, number, callback) {
    logger.info("findInvoice ----");
    tickets.findOrCreateTicket(companyId, function (err, ticket) {
        if (err) {
            err = "Error trying to find or create Ticket: " + err;
            callback(err);
            return;
        }

        createClientAfipWSFEv1(function (err, client) {
                var args = [{
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
                }];

                client.FECompConsultar(args, function (err, result) {
                    var parseString = require('xml2js').parseString;
                    logger.info("FECompConsultar returned");
                    logger.info("Soap message: " + client.lastRequest);

                    if (err) {
                        logger.error("FECompConsultar error returned");
                        //var cleanedErr = err.replace("\ufeff", "");
                        parseString(err.body, function (err, parsedErr) {
                            if (err) {
                                logger.error("parseString: Error parsing string. Error: " + err);
                                callback("parseString: Error parsing string. Error: " + err);
                                logger.info("findInvoice ++++");
                                return;

                            }
                            logger.info("FECompConsultar parsed");
                            callback(err, parsedErr);
                        });
                        return;
                    }

                    if(result.FECompConsultarResult.Errors) {
                        callback(result.FECompConsultarResult.Errors.Err, null);
                        logger.info("findInvoice ++++");

                    } else {
                        callback(null, result.FECompConsultarResult.ResultGet);
                        logger.info("findInvoice ++++");
                    }
                });
            }
        );
    });
};


function createClientAfipWSFEv1(callback) {
    logger.info("invokeAfipWSFEv1 --------------- ");
    var soap = require('soap');


    var url = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL';

    soap.createClient(url, function (err, client) {
        callback(err, client);
    });
    logger.info("invokeAfipWSFEv1 ++++++++++++++ ");

}

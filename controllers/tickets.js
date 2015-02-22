/**
 * Created by sebastianbromberg on 21/2/15.
 */
var save = require('save')
    , saveTicket = save('ticket');
var logger = require('winston');
var moment = require('moment');

saveTicket.on('create', function() {
    console.log('New ticket created!')
});

exports.findOrCreateTicket = function findOrCreateTicket(companyId, callback) {
    logger.info("findOrCreateTicket ----");
    saveTicket.find({"company" : companyId}, function (err, tickets){
        if (err) {
            logger.error("Error finding ticket for company: " + companyId + ". Error: " + err);
            callback (err);
            return;
        }

        if (tickets && tickets.length > 0 ) {
            logger.info ("Ticket found for company " + companyId + "checking time ....");
            var expTime = moment(tickets[0].exptime);
            if (moment().diff(expTime) < 0) {
                logger.info("Difference: " + moment().diff(expTime));
                callback (err, tickets[0]);
            } else {
                saveTicket.delete(tickets[0]._id, function(err) {
                    if (err) {
                        callback (err);
                        return;
                    }
                    exports.findOrCreateTicket(companyId, function (err, ticket){
                        callback (err, ticket);
                    })
                })
            }
        } else {
            var cmsBuilder = require("../builders/cmsBuilder");
            var cms = new cmsBuilder.CmsBuilder(companyId, function (err, newTicket) {
                if (err) {
                    if (err.code && err.message) {
                        customErr = "Code: " + err.code ;
                        customErr = customErr + "Message: " + err.message;
                        callback (customErr);
                    } else
                    {
                        callback (err);
                    }

                    logger.info("findOrCreateTicket ++++");
                    return;
                }
                console.dir(newTicket);
                saveTicket.create(newTicket);
                callback(err, newTicket);
                logger.info("findOrCreateTicket ++++");
            });
        }
    } );
};
/**
 * Created by sebastianbromberg on 21/2/15.
 */
let save = require('save'),
  saveTicket = save('ticket'),
  moment = require('moment'),
  cmsBuilder = require('../builders/cmsBuilder');

saveTicket.on('create', () => {
  'use strict';
  log.debug('New ticket created!');
});

exports.findOrCreateTicket = (companyId, callback) => {
  'use strict';

  log.debug('findOrCreateTicket ----');
  saveTicket.find({ company: companyId }, (err, tickets) => {
    if (err) {
      log.error(
        'Error finding ticket for company: ' + companyId + '. Error: ' + err
      );
      log.debug('findOrCreateTicket +++++');
      return callback(err);
    }

    if (tickets && tickets.length > 0) {
      log.debug('Ticket found for company ' + companyId + 'checking time ....');
      let expTime = moment(tickets[0].exptime);

      if (moment().diff(expTime) < 0) {
        log.debug('Difference: ' + moment().diff(expTime));
        return callback(err, tickets[0]);
      }

      saveTicket.delete(tickets[0]._id, err2 => {
        if (err2) {
          return callback(err);
        }
        exports.findOrCreateTicket(companyId, (err3, ticket) => {
          log.debug('findOrCreateTicket +++++');
          return callback(err3, ticket);
        });
      });
    } else {
      cmsBuilder.buildTicket(companyId, (err2, newTicket) => {
        if (err2) {
          if (err2.code && err2err.message) {
            customErr = 'Code: ' + err2.code;
            customErr = customErr + 'Message: ' + err2.message;
            log.debug('findOrCreateTicket ++++');
            return callback(customErr);
          }

          log.debug('findOrCreateTicket ++++');
          return callback(err2);
        }

        log.debug(newTicket);
        saveTicket.create(newTicket);
        log.debug('findOrCreateTicket +++++');
        return callback(err, newTicket);
      });
    }
  });
};

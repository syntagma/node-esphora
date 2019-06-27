const config = require('config');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const soap = require('soap');

const createClientAfipWSFEv1 = callback => {
  'use strict';
  logger.debug('invokeAfipWSFEv1 --------------- ');

  const url = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL';

  soap.createClient(url, (err, client) => {
    callback(err, client);
  });
  logger.debug('invokeAfipWSFEv1 ++++++++++++++ ');
};
module.exports.createClientAfipWSFEv1 = createClientAfipWSFEv1;

const { Invoice } = require('../models');
const Boom = require('@hapi/boom');
const Afip = require('../services/afip.soap.service');
const parseString = require('xml2js').parseString;
const soap = require('soap');

const create = async (req, res) => {
  const body = req.payload;

  body.status = 'pending';
  return Inovice.create(body)
    .then(invoice => {
      return {
        success: true,
        message: 'Successfully created new invoice.',
        data: {
          invoice: invoice.toWeb()
        }
      };
    })
    .catch(err => {
      return Boom.badRequest(err.message, err);
    });
};
module.exports.create = create;

const get = async (req, res) => {
  return Inovice.findById(req.params.id)
    .then(invoice => {
      return { success: true, invoice: invoice.toWeb() };
    })
    .catch(err => {
      return Boom.badRequest(err.message, err);
    });
};
module.exports.get = get;

const test = async (req, res) => {
  'use strict';
  const url = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL';
  const args = {};

  const client = await soap.createClientAsync(url);
  if (!client) {
    throw Boom.notFound(`No client available for »${url}«`);
  }

  const test = await client.FEDummyAsync(args);
  if (!test) {
    throw Boom.notFound(`No response available for »${client}«`);
  }
  return test;

  /*
  const response = client.FEDummy(args, (err, test) => {
    if (!test) {
      throw Boom.notFound(`No response available for »${client}«`);
    }
    return test;
  });
  */
  /*
  return Afip.createClientAfipWSFEv1()
    .then(client => {
      const args = {};
      client.FEDummy(args, (err4, result) => {
        if (err4) {
          logger.error('FEDummy error returned');
          parseString(err.body, (err5, parsedErr) => {
            if (err5) {
              logger.error('parseString: Error parsing string. Error: ' + err5);
              logger.debug('FEDummy ++++');
              return callback(
                'parseString: Error parsing string. Error: ' + err5
              );
            }
            logger.debug('FEDummy parsed');
            logger.debug('FEDummy ++++');
            return callback(err5, parsedErr);
          });
        }

        logger.debug('FEDummy returned');
        logger.debug('Soap message: ' + client.lastRequest);

        if (result.FEDummyResult.Errors) {
          logger.debug('FEDummy ERRORS');
          logger.error(result.FEDummyResult.Errors.Err[0].Msg);
          logger.debug('FEDummy ++++');
          return callback(result.FEDummyResult.Errors.Err[0].Msg);
        }

        logger.debug('FEDummy ++++');
        return callback(null, result.FEDummyResult);
      });
    })
    .catch(err => {
      return Boom.badRequest(
        'Se ha producido un error al crear createClientAfipWSFEv1: ' +
          err.message,
        err
      );
    });
    */
};
module.exports.test = test;

const update = async (req, res) => {
  const id = req.params.id;
  const body = req.payload;

  return Inovice.findById(id)
    .then(invoice => {
      invoice.set(body);
      invoice.status = 'pending';
      invoice.__user = req.auth.credentials.user;
      return invoice.save().then(invoice => {
        if (invoice.type == 'associated') {
          let trucks = [];
          for (item of invoice.items) {
            for (truck of item.linked_trucks) {
              if (trucks.indexOf(truck.truck_id) == -1) {
                trucks.push(truck.truck_id);
                calculateTopDown(truck.truck_id);
              }
            }
          }
        }

        return {
          success: true,
          message: 'Successfully udpate invoice.',
          data: {
            invoice: invoice.toWeb()
          }
        };
      });
    })
    .catch(err => {
      return Boom.badRequest(err.message, err);
    });
};
module.exports.update = update;

const remove = async (req, res) => {
  const id = req.params.id;

  return Inovice.deleteOne({ _id: id })
    .then(() => {
      return {
        success: true,
        message: 'Successfully delete invoice.'
      };
    })
    .catch(err => {
      return Boom.badRequest(err.message, err);
    });
};
module.exports.remove = remove;

const approve = async (req, res) => {
  const id = req.params.id;

  return Inovice.findById(id)
    .then(invoice => {
      invoice.status = 'approved';
      invoice.__user = req.auth.credentials.user;
      return invoice.save().then(invoice => {
        return {
          success: true,
          message: 'Successfully approved invoice.'
        };
      });
    })
    .catch(err => {
      return Boom.badRequest(err.message, err);
    });
};
module.exports.approve = approve;

const reject = async (req, res) => {
  const id = req.params.id;

  return Inovice.findById(id)
    .then(invoice => {
      invoice.status = 'rejected';
      invoice.__user = req.auth.credentials.user;
      return invoice.save().then(invoice => {
        return {
          success: true,
          message: 'Successfully rejected invoice.'
        };
      });
    })
    .catch(err => {
      return Boom.badRequest(err.message, err);
    });
};
module.exports.reject = reject;

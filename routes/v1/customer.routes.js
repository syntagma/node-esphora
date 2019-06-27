const Joi = require('joi');
const CustomerController = require('../../controllers/customer.controller');

const Relish = require('relish')({
  messages: {}
});

const customerSchema = Joi.object().keys({
  company: Joi.string().required(),
  cuit: Joi.number().required(),
  sap_client_code: Joi.string().required()
});

module.exports = [
  {
    method: 'POST',
    path: '/v1/customers',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        failAction: Relish.failAction,
        payload: customerSchema.unknown()
      }
    },
    handler: CustomerController.create
  },
  {
    method: 'GET',
    path: '/v1/customers/{id}',
    config: { auth: 'jwt' },
    handler: CustomerController.get
  },
  {
    method: 'PUT',
    path: '/v1/customers/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        failAction: Relish.failAction,
        payload: customerSchema.unknown()
      }
    },
    handler: CustomerController.update
  },
  {
    method: 'DELETE',
    path: '/v1/customers/{id}',
    config: { auth: 'jwt' },
    handler: CustomerController.remove
  },
  {
    method: 'POST',
    path: '/v1/customers/{id}/historical',
    config: { auth: 'jwt' },
    handler: CustomerController.addHistoricalData
  },
  {
    method: 'POST',
    path: '/v1/customers/{id}/searches',
    config: { auth: 'jwt' },
    handler: CustomerController.addSearchData
  },
  {
    method: 'POST',
    path: '/v1/customers/financeContact',
    // config: { auth: 'jwt' },
    handler: CustomerController.financeContact
  },
  {
    method: 'POST',
    path: '/v1/customers/interestedContact',
    // config: { auth: 'jwt' },
    handler: CustomerController.interestedContact
  }
];

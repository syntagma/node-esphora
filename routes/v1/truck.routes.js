const Joi = require('joi');
const TruckController = require('../../controllers/truck.controller');

const Relish = require('relish')({
  messages: {}
});

const truckSchema = Joi.object().keys({
  domain: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  model_version: Joi.string().required(),
  status: Joi.string().required()
});

module.exports = [
  {
    method: 'POST',
    path: '/v1/trucks',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        failAction: Relish.failAction,
        payload: truckSchema.unknown()
      }
    },
    handler: TruckController.create
  },
  {
    method: 'POST',
    path: '/v1/trucks/{id}/photos',
    config: {
      auth: 'jwt',
      payload: {
        output: 'stream',
        allow: 'multipart/form-data',
        maxBytes: 209715200
      }
    },
    handler: TruckController.uploadImages
  },
  {
    method: 'DELETE',
    path: '/v1/trucks/{id_truck}/photos/{id_photo}',
    config: { auth: 'jwt' },
    handler: TruckController.deleteImages
  },
  {
    method: 'PUT',
    path: '/v1/trucks/{id_truck}/photos/{id_photo}',
    config: { auth: 'jwt' },
    handler: TruckController.updateImages
  },
  {
    method: 'POST',
    path: '/v1/trucks/{id}/expenses',
    config: { auth: 'jwt' },
    handler: TruckController.addExpenses
  },
  {
    method: 'POST',
    path: '/v1/trucks/{id_truck}/expenses/{id_expense}/approve',
    config: { auth: 'jwt' },
    handler: TruckController.approveExpenses
  },
  {
    method: 'GET',
    path: '/v1/trucks/{id}',
    config: {
      auth: {
        strategy: 'jwt'
      }
    },
    handler: TruckController.get
  },
  {
    method: 'PUT',
    path: '/v1/trucks/{id}',
    config: { auth: 'jwt' },
    handler: TruckController.update
  },
  {
    method: 'DELETE',
    path: '/v1/trucks/{id}',
    config: { auth: 'jwt' },
    handler: TruckController.remove
  },
  {
    method: 'GET',
    path: '/v1/trucks/{id_truck}/photos/{id_photo}',
    config: { auth: false },
    handler: TruckController.getImage
  },
  {
    method: 'PUT',
    path: '/v1/trucks/{id}/topDown',
    config: { auth: 'jwt' },
    handler: TruckController.updateTopDown
  },
  {
    method: 'PUT',
    path: '/v1/trucks/{id}/topDown/approve',
    config: { auth: 'jwt' },
    handler: TruckController.approveTopDown
  },
  {
    method: 'PUT',
    path: '/v1/trucks/{id}/topDown/reject',
    config: { auth: 'jwt' },
    handler: TruckController.rejectTopDown
  }
];

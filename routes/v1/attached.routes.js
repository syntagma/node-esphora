const AttachedController = require('../../controllers/attached.controller');

module.exports = [
  {
    method: 'POST',
    path: '/v1/attachments',
    config: {
      auth: 'jwt',
      payload: {
        output: 'stream',
        allow: 'multipart/form-data'
      }
    },
    handler: AttachedController.upload
  },
  {
    method: 'GET',
    path: '/v1/attachments/{id}',
    config: { auth: 'jwt' },
    handler: AttachedController.get
  },
  {
    method: 'GET',
    path: '/v1/attachments/{entity_id}/list',
    config: { auth: 'jwt' },
    handler: AttachedController.list
  },
  {
    method: 'DELETE',
    path: '/v1/attachments/{id}',
    config: { auth: 'jwt' },
    handler: AttachedController.remove
  }
];

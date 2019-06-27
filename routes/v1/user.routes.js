const UserController = require('../../controllers/user.controller');

module.exports = [
  {
    method: 'POST',
    path: '/v1/users/login',
    config: { auth: false },
    handler: UserController.login
  },
  {
    method: 'POST',
    path: '/v1/users/resetPassword',
    config: { auth: false },
    handler: UserController.resetPassword
  },
  {
    method: 'PUT',
    path: '/v1/users/newPassword',
    config: { auth: 'jwt' },
    handler: UserController.newPassword
  },
  {
    method: 'GET',
    path: '/v1/users/me',
    config: { auth: 'jwt' },
    handler: UserController.me
  },
  {
    method: 'POST',
    path: '/v1/users',
    config: { auth: false },
    handler: UserController.create
  },
  {
    method: 'PUT',
    path: '/v1/users',
    config: { auth: 'jwt' },
    handler: UserController.update
  },
  {
    method: 'GET',
    path: '/v1/users',
    config: { auth: 'jwt' },
    handler: UserController.list
  },
  {
    method: 'GET',
    path: '/v1/users/{id}',
    config: { auth: 'jwt' },
    handler: UserController.get
  }
];

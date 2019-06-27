let v1 = require('./v1'),
  root = [
    {
      method: 'GET',
      path: '/',
      config: { auth: false },
      handler: async (req, res) => {
        return 'Hola Facturs-Afip!';
      }
    }
  ];

module.exports = [].concat(v1, root);

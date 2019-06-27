const hapi = require('@hapi/hapi');
const routes = require('./routes');
const config = require('config');
const { ApolloServer } = require('apollo-server-hapi');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const winston = require('winston');
const goodWinston = require('hapi-good-winston').goodWinston;
const Ddos = require('ddos');
const ddos = new Ddos({ burst: 20, limit: 20 });
const RollbarTransport = require('winston-transport-rollbar-3');
const rollbarConfig = {
  accessToken: 'c2b32d963c3749b985edf4e9d51b6709',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true
};

global.logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new RollbarTransport({
      rollbarConfig,
      level: 'warn'
    })
  ]
});

const goodWinstonOptions = {
  levels: {
    response: 'debug',
    error: 'info'
  }
};

const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    // Simple and straight forward usage
    winston: [goodWinston(logger)],
    // Adding some customization configuration
    winstonWithLogLevels: [goodWinston(logger, goodWinstonOptions)],
    // This example simply illustrates auto loading and instantiation made by good
    winston2: [
      {
        module: 'hapi-good-winston',
        name: 'goodWinston',
        args: [logger, goodWinstonOptions]
      }
    ]
  }
};

const app = hapi.server({
  port: process.env.PORT || config.get('app.port'),
  routes: {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://ip.syntag.ma',
        'http://localhost'
      ],
      headers: ['Accept', 'Content-Type', 'Accept-Language'],
      additionalHeaders: ['Cache-Control', 'X-Requested-With', 'Authorization']
    }
  }
});

const init = async () => {
  /*
	await server.register([
	Inert,
	Vision,
	{
	plugin: HapiSwagger,
	options: {
	info: {
	title: 'Paintings API Documentation',
	version: Pack.version
}
}
}
]);*/

  await app.register(require('hapi-auth-jwt2'));
  await app.register({
    plugin: require('good'),
    options
  });

  app.auth.strategy('jwt', 'jwt', {
    key: config.get('jwt.encryption'),
    validate: require('./auth_jwt_validate.js'),
    verifyOptions: { algorithms: ['HS256'] }
  });

  app.route(routes);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    //context: ({ request: Request, h: ResponseToolkit }) => ({ request, h }),
    route: {
      auth: {
        // This option will determine what HapiJS will do with your default strategy.
        // Try means it will tty to authenticate, but on failure it won't block the request.
        // By passing the request object into your context, you can access it inside of your resolvers
        // and check the request.auth object for authentication properties.
        strategy: 'jwt',
        mode: 'try'
      },
      introspection: process.env.NODE_ENV === 'development'
    },
    graphqlOptions: request => ({
      schema,
      context: request // hapi request
    })
    /*
    context: async ({ request, h }) => {
      const credentials = request.auth.credentials;
      return { credentials };
    }
    */
  });

  app.ext('onRequest', ddos.hapi17.bind(ddos));

  await server.applyMiddleware({
    app,
    path: '/v1/queries'
  });

  await server.installSubscriptionHandlers(app.listener);

  await app.start();
  logger.info(`Server running at: ${app.info.uri}`);
};

process.on('unHandledRejection', err => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
});

init().catch(err => {
  logger.error(err);
});

module.exports = app;

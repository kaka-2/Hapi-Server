'use strict'

const Hapi = require('@hapi/hapi');
const pino = require('hapi-pino')
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const pack = require('./package')
const routes = require('./config/routes');
const { KEY } = require('./config/config');
const knex = require('./src/knex');
const log = console.log;

//server config
const server = Hapi.server({
  port: 3000,
  host: '127.0.0.1'
});

//swagger
const swaggerOptions = {
  info: {
    title: 'Hapi API Documentation',
    version: pack.version
  }
}

//routes
server.route(routes)

//validate
const validate = async function (decoded, request) {
  const [user] = await knex('users').where({ email: decoded.email });
  if (!user) {
    return { isValid: false };
  }
  else {
    return { isValid: true };
  }
};

const init = async () => {
  await server.register(require('hapi-auth-jwt2'));
  await server.register([ Inert, Vision, { plugin: HapiSwagger, options: swaggerOptions }]);
  await server.register({plugin: pino, options: { prettyPrint: false, redact: [ 'req.headers.authorization'] ,tags:['info']}});
  server.auth.strategy('token', 'jwt', { key: KEY, validate: validate,verifyOptions: { algorithms: [ 'HS256']}})
  server.auth.default('token')
  await server.start();
  console.log(`Server running on %s`,server.info.uri);
};

process.on('unhandledRejection', (err) => {
  log(err);
  process.exit(1);
});

init();

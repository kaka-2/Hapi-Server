const User = require('./controller');

module.exports = [ 
  {
        path: '/',
        method: 'GET',
        options: {
          tags:['api'],
          notes: 'returns Hallo ',
          description: 'Used to test server if its working',
          auth: false
        },
        handler: (request , h ) => {
          return h.response({message: 'Hello'}).code(200);
        }
  },

  {
    path: '/v1/{name}',
    method: 'GET',
    options: {
      tags:['api'],
      notes: 'returns Hallo {name}',
      description: 'Used to test server if its working',
      auth: false
    },
    handler: (request , h ) => {
      request.logger.info(`In handler %s`, request.path);
      return h.response({message: `Hello ${encodeURIComponent(request.params.name)}`}).code(200);
    }
  },

  {
    path: '/users',
    method: 'GET',
    options: {
      tags:['api'],
      notes: 'returns all users ',
      description: 'fetch all users from the database'
    },
    handler: User.findAll
  },

  {
    path: '/user',
    method: 'POST',
    options: {
      tags:['api'],
      notes: 'returns user ',
      description: 'fetch token by email and password',
      auth: false
    },
    handler: User.findOne
  },

  {
    path: '/users',
    method: 'POST',
    options: {
      tags:['api'],
      notes: 'returns created user ',
      description: 'create user by email, names and password'
    },
    handler: User.create
  },

  {
    path: '/users',
    method: 'DELETE',
    options: {
      tags:['api'],
      notes: 'delete user ',
      description: 'delete user by email'
    },
    handler: User.delete
  },

  {
    path: '/users',
    method: 'PUT',
    options: {
      tags:['api'],
      notes: 'returns updated user ',
      description: 'updates the user'
    },
    handler: User.update
  }
]
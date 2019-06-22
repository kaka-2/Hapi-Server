const Boom = require('@hapi/boom');
const knex = require('../src/knex');
const { KEY } = require('./config');
const jwt = require('jsonwebtoken');
const Bcrypt = require('bcrypt');

module.exports = {
    create: async ( request , h ) => {
        if( !request.payload.email || !request.payload.names || !request.payload.password ) {
            throw Boom.badData('please ensure all fields are provided');
        }
        
        const user = request.payload;

        const hash_password = await Bcrypt.hash(user.password,12);

        let results = await knex('users').insert({
            names: user.names,
            password: hash_password,
            email: user.email
        });

        if (! results ) {
            throw Boom.notFound('user not created');
        }

        return h.response({
            statusCode: 200,
            data: results,
            message: 'user created successfully'
        }).code(200);
    },

    findAll: async (request, h) => {
        let results = await knex.select().table('users');

        if ( !results ) {
            throw Boom.notFound('user not found');
        }

        return h.response({
            statusCode: 200,
            data: results,
            message: 'users fetched successfully' 
        }).code(200);
    },

    findOne: async (request, h) => {
        const user = request.payload;

        let [results] = await knex('users').where({ email: user.email });

        if ( !results) {
            throw Boom.notFound('user not found');
        }
        
        const match = await Bcrypt.compare(user.password,results.password);

        if ( !match ) {
            throw Boom.unauthorized('invalid password');
        }

        const token = jwt.sign({
            id: results.id,
            names: results.names,
            email: results.email
        },KEY,{algorithm: 'HS256', expiresIn: '1h'});

        return h.response({
            statusCode: 200,
            data: token,
            message: 'user fetched successfully' 
        }).code(200);
    },

    update: async (request, h) => {

        if ( !request.params.id ) {
            var error = new Error('Please provide an ID');
            throw Boom.boomify(error,{statusCode: 400});
        }
        let attributes = {};

        if ( request.payload.names) {
            attributes.names = request.payload.names;
        }

        if ( request.payload.email) {
            attributes.email = request.payload.email;
        }

        if ( request.payload.password) {
            attributes.password = Bcrypt.hash(request.payload.password,12);
        }

        let results = await knex('users').where({id: request.params.id }).update(attributes);

        if ( !results ) {
            throw Boom.badRequest('invalid request');
        }

        return h.response({
            statusCode: 200,
            data: results,
            message: 'user updated successfully' 
        }).code(200);
    },

    delete: async (request, h) => {

        const user = request.payload;
        if ( !user ) {
            var error = new Error('Please provide an email');
            throw Boom.boomify(error,{statusCode: 400});
        }

        let results = await knex('users').where(user).del();

        if ( !results ) {
            throw Boom.badRequest('invalid request');
        }

        return h.response({
            statusCode: 200,
            data: results,
            message: 'user deleted successfully' 
        }).code(200);
    }
}
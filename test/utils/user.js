// Bibliotecas
const request = require('supertest');
const bcrypt = require('bcryptjs');

//Aplicação
const app = require('../../app');
const postUser = require('../rest/fixture/requisicoes/usuario/postUser.json');

const registerUser = async (bodyUser) =>
    await request(app)
        .post('/users/register')
        .set('Content-type', 'application/json')
        .send(bodyUser);

const login = async (bodyLogin) =>
    await request(app)
        .post('/users/login')
        .set('Content-type', 'application/json')
        .send(bodyLogin);

module.exports = { registerUser, login }
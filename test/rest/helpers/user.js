// Bibliotecas
const request = require('supertest');
const bcrypt = require('bcryptjs');

//Aplicação
const app = require('../../../app');
const postUser = require('../fixture/requisicoes/usuario/postUser.json');

const createUser = async (username, password) => {
    const bodyUser = { ...postUser };
    bodyUser.username = username || postUser.username;
    bodyUser.password = bcrypt.hashSync(password || postUser.password, 8);

    const response = await request(app)
        .post('/users/register')
        .set('Content-type', 'application/json')
        .send(bodyUser);

    return response.body;
}

module.exports = { createUser }
const request = require('supertest');
const { expect } = require('chai');

// Aplicação
const { login, getUsers } = require('../../utils/user')
const app = require('../../../app');
const postLogin = require('../fixture/requisicoes/login/postLogin.json')
const { createUser } = require('../../utils/user');
const auth = require('../helpers/authentication')
const postUser = require('../fixture/requisicoes/usuario/postUser.json')


describe('User Controller', () => {
    describe('POST /users/register', () => {
        it('CT-2.1 - Registro de usuário válido', async () => {
            const username = `usuario_valido_${Date.now()}`;
            const user = await createUser(username, postUser.password);

            expect(user.username).to.equal(username);
            expect(user.saldo).to.equal(10000);
        });

        it('CT-2.2 - Registro de usuário sem favorecidos', async () => {
            const newUser = { ...postUser };
            newUser.favorecidos = [];

            const response = await request(app)
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(newUser);

            expect(response.status).to.equal(201);
            expect(response.body.saldo).to.equal(10000);
        })

        it('CT-2.3 - Registro com username vazio', async () => {
            const newUser = { ...postUser };
            newUser.username = ''
            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.status).to.equal(400);
        });

        it('CT-2.4 - Registro com password vazio', async () => {
            const newUser = { ...postUser };
            newUser.password = ''
            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.status).to.equal(400);
        });

        it('CT-2.5 - Registro de usuário duplicado', async () => {
            const newUser = { ...postUser };
            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.status).to.equal(400);
        });
        
        it.skip('CT-2.6 - Registro com favorecidos inválidos', async () => {
            const newUser = { ...postUser };
            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.status).to.equal(400);
        });

        it('CT-2.7 - Registro sem username e password', async () => {
            const newUser = { ...postUser };
            newUser.username = '',
            newUser.password = ''
            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.status).to.equal(400);
        });

        it.skip('CT-2.8 - Registro usando método não permitido', async () => {
            const newUser = { ...postUser };
            const response = await request(app)
                .get('/users/register')
                .send(newUser);
            console.log(response.status)
            expect(response.status).to.equal(404);
        });

    });

    describe('POST /users/login', () => {
        it('Deve retornar 200 quando login bem-sucedido ', async () => {
            const bodyLogin = { ...postLogin };

            const response = await login(bodyLogin);

            expect(response.status).to.equal(200);
            expect(response.body.token).to.be.a('string');
        });

        it('Deve retornar 400 quando usuário inválido ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.username = "teste";

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);
        });

        it('Deve retornar 400 quando inserido um tipo inteiro no username que é string', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.username = 123;

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);
        });

        it('Deve retornar 400 quando envio username vazio', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.username = "";

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);
        });

        it('Deve retornar 400 quando não enviado o username', async () => {
            const bodyLogin = { ...postLogin };
            delete bodyLogin.username;

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);
        });

        it('Deve retornar 400 quando senha inválida ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.password = "1234567";

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);

        });

        it('Deve retornar 400 quando inserido um tipo inteiro no password que é string ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.password = 123;

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);

        });

        it('Deve retornar 400 quando enviar o password vazio ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.password = "";

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);

        });

        it('Deve retornar 400 quando não enviar o campo password ', async () => {
            const bodyLogin = { ...postLogin };
            delete bodyLogin.password;

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);
        });

        it('Deve retornar 400 quando não enviado os campos username e password ', async () => {
            const bodyLogin = { ...postLogin };
            delete bodyLogin.username;
            delete bodyLogin.password;

            const response = await login(bodyLogin);

            expect(response.status).to.equal(400);
        });
    });

    describe('GET /users', () => {

        //Teste 1: Verifica se a resposta contém uma lista de usuários em formato JSON com os campos corretos
        it('Deve retornar 200 OK com lista de usuários contendo os campos esperados', async () => {
            const resposta = await request(app)
                .get('/users')

            expect(resposta.status).to.equal(200);
        });

        it('Lista de usuários em JSON com username, favorecidos e saldo (tipagem)', async () => {
            const resposta = await request(app)
                .get('/users');

            const usuarios = Array.isArray(resposta.body) ? resposta.body : JSON.parse(resposta.text);

            // Verifica se o corpo é um array
            expect(usuarios).to.be.a('array');

            // Teste 2: Verifica se cada usuário tem os campos esperados e valida os tipos
            usuarios.forEach(u => {
                expect(u).to.have.property('username').that.is.a('string');
                expect(u).to.have.property('favorecidos').that.is.an('array');
                expect(u).to.have.property('saldo').that.is.a('number');

            });
        });

        // Teste 3: Verifica se não há usuários duplicados (mesmo username)
        it('Não deve haver usuários duplicados', async () => {
            const resposta = await request(app)
                .get('/users');

            const usuarios = Array.isArray(resposta.body) ? resposta.body : [];

            // Extrai os usernames e normaliza (sem espaços e tudo minúsculo)
            const usernames = usuarios.map(u => u.username?.trim().toLowerCase());

            // Cria um conjunto com os usernames únicos
            const usernamesUnicos = new Set(usernames);

            // Compara: se o tamanho do conjunto for igual à lista, não há duplicados
            expect(usernamesUnicos.size).to.equal(usernames.length);
        });

    });
});

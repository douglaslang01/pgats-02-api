const request = require('supertest');
const { expect } = require('chai');

// Aplicação
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
            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(response.status).to.equal(200);
            expect(response.body.token).to.be.a('string');

        });
        it('Deve retornar 400 quando usuário inválido ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.username = "teste";

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(response.status).to.equal(400);


        });
        it('Deve retornar 400 quando inserido um tipo inteiro no username que é string', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.username = 123;

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });
        it('Deve retornar 400 quando envio username vazio', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.username = "";

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });
        it('Deve retornar 400 quando não enviado o username', async () => {
            const bodyLogin = { ...postLogin };
            delete bodyLogin.username;

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });

        it('Deve retornar 400 quando senha inválida ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.password = "1234567";

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });
        it('Deve retornar 400 quando inserido um tipo inteiro no password que é string ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.password = 123;

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });
        it('Deve retornar 400 quando enviar o password vazio ', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.password = "";

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });
        it('Deve retornar 400 quando não enviar o campo password ', async () => {
            const bodyLogin = { ...postLogin };
            delete bodyLogin.password;

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });
        it('Deve retornar 400 quando não enviado os campos username e password ', async () => {
            const bodyLogin = { ...postLogin };
            delete bodyLogin.username;
            delete bodyLogin.password;

            const response = await request(app)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);


            expect(response.status).to.equal(400);

        });
    });

    describe('GET /users', () => {

    });
});

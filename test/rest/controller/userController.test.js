const request = require('supertest');
const { expect } = require('chai');

// Aplicação
const app = require('../../../app');
const postLogin = require('../fixture/requisicoes/login/postLogin.json')


describe('User Controller', () => {
    describe('POST /users/register', () => {

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

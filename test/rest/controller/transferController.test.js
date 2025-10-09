// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');

// Aplicação
const app = require('../../../app');
const auth = require('../helpers/authentication');
const { registerUser } = require('../../utils/user');
const transferUtils = require('../../utils/transfer');

//Fixtures
const postUserObject = require('../fixture/requisicoes/usuario/postUser.json');
const postTransferObject = require('../fixture/requisicoes/transferencias/postTransfer.json');

// Testes
describe('Transfer Controller', () => {
    let token;
    before(async () => {
        token = await auth.getToken();
    });
    describe('POST /transfers', () => {
        let bodyTransfer;
        beforeEach(async () => {
            const fromUserBody = { ...postUserObject };

            fromUserBody.username = faker.internet.username();
            const fromUser = await registerUser(fromUserBody);

            bodyTransfer = { ...postTransferObject };
            bodyTransfer.from = fromUser.body.username;
        });

        describe('Transferencias para não favorecidos', () => {
            beforeEach(async () => {
                const toUserBody = { ...postUserObject };

                toUserBody.username = faker.internet.username();
                const toUser = await registerUser(toUserBody);

                bodyTransfer.to = toUser.body.username;
            });

            it.skip('CT5.1 - Transferência de R$ 5.000,00 para não favorecido deve retornar 201', async () => {
                bodyTransfer.value = 5000.00;

                const res = await transferUtils.postTransfer(token, bodyTransfer);

                expect(res.status).to.equal(201);
                expect(res.body).to.have.not.property('error');
            });

            it('CT5.2 - Transferência de R$ 5.000,01 para não favorecido deve retornar 400', async () => {
                bodyTransfer.value = 5000.01;

                const res = await transferUtils.postTransfer(token, bodyTransfer);

                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error', 'Transferência acima de R$ 5.000,00 só para favorecidos');
            });
        })

        it('CT5.3 - Transferência de R$ 5.000,01 para favorecido deve retornar 201', async () => {
            bodyTransfer.to = 'priscila';
            bodyTransfer.value = 5000.01;

            const res = await transferUtils.postTransfer(token, bodyTransfer);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('from', bodyTransfer.from);
            expect(res.body).to.have.property('to', bodyTransfer.to);
            expect(res.body).to.have.property('value', bodyTransfer.value);
            expect(res.body).to.have.property('date');
        });

        it('CT5.4 - Transferência sem autenticação deve retornar 401', async () => {
            bodyTransfer.to = 'priscila';
            bodyTransfer.value = 100;

            const res = await request(app)
                .post('/transfers')
                .send(bodyTransfer);

            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('message', 'Token não fornecido.');
        });

        it('CT5.5 - Transferência para usuário inexistente deve retornar 400', async () => {
            bodyTransfer.to = faker.internet.username();
            bodyTransfer.value = 100;

            const res = await transferUtils.postTransfer(token, bodyTransfer);

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
        });

        it('CT5.6 - Transferência com valor maior que o saldo deve retornar 400', async () => {
            bodyTransfer.to = 'priscila';
            bodyTransfer.value = 10000.01;

            const res = await transferUtils.postTransfer(token, bodyTransfer);

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Saldo insuficiente');
        });

        it.skip('CT5.7 - Transferência com valor negativo deve retornar 400', async () => {
            bodyTransfer.to = 'priscila';
            bodyTransfer.value = -0.01;

            const res = await transferUtils.postTransfer(token, bodyTransfer);

            expect(res.status).to.equal(400);
        });

        it('CT5.8 - Transferência com valor inválido deve retornar 400', async () => {
            bodyTransfer.to = 'priscila';
            bodyTransfer.value = "cinco mil";

            const res = await transferUtils.postTransfer(token, bodyTransfer);

            expect(res.status).to.equal(400);
            //expect(res.body).to.have.property('error', 'Valor da transferência inválido.');
        });

    });

    describe('GET /transfers', () => {
        it('CT6.1 - Sucesso ao listar transferências', async () => {
            const response = await transferUtils.getTransfers(token);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            // Validação básica do formato dos dados
            if (response.body.length > 0) {
                expect(response.body[0]).to.have.all.keys('from', 'to', 'value', 'date');
            }
        });

        it('CT6.2 - Falha ao listar transferências sem autenticação', async () => {
            const response = await request(app)
                .get('/transfers');
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message').that.includes('Token');
        });

        it('CT6.3 - Falha ao listar transferências com token inválido', async () => {
            const response = await request(app)
                .get('/transfers')
                .set('Authorization', 'Bearer token_invalido');
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
        });

        it('CT6.4 - Validação do formato dos dados retornados', async () => {
            const response = await transferUtils.getTransfers(token);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            if (response.body.length > 0) {
                response.body.forEach(transfer => {
                    expect(transfer).to.have.all.keys('from', 'to', 'value', 'date');
                });
            }
        });

        it('CT6.5 - Endpoint inexistente', async () => {
            const response = await request(app)
                .get('/transferencias')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).to.equal(404);
        });

        it('CT6.6 - Método não permitido', async () => {
            const response = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect([400, 405]).to.include(response.status);
        });
    });
});

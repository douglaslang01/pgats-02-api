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
        it('Primeiro teste de exemplo', async () => {
            //const transfersArranged = await transferUtils.populateTransfers(token); //Arrange

            const resp = await transferUtils.getTransfers(token); //Action

            //Assert
            expect(resp.status).to.equal(200);
            //expect(response.body).to.have.lengthOf(transfersArranged.length);
        });
    });
});

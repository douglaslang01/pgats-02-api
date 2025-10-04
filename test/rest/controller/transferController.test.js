// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../../app');
const auth = require('../helpers/authentication')
const { createUser } = require('../helpers/user');

// Mock
const transferService = require('../../../service/transferService');

//Fixtures
const postTransfer = require('../fixture/requisicoes/transferencias/postTransfer.json');

// Testes
describe('Transfer Controller', () => {
    let token;
    describe('POST /transfers', () => {
        before(async () => {
            token = await auth.getToken();
        });

        describe('Transferencias para não favorecidos', () => {
            let newUser;
            let reqTransfer;
            before(async () => {
                newUser = await createUser('maria');
                reqTransfer = { ...postTransfer };
                reqTransfer.to = newUser.username;
            })

            it.skip('CT5.1 - Transferência de R$ 5.000,00 para não favorecido deve retornar 201', async () => {
                reqTransfer.value = 5000.00;

                const res = await request(app)
                    .post('/transfers')
                    .set('Authorization', `Bearer ${token}`)
                    .send(reqTransfer);

                expect(res.status).to.equal(201);
                expect(res.body).to.have.not.property('error');
            });

            it('CT5.2 - Transferência de R$ 5.000,01 para não favorecido deve retornar 400', async () => {
                reqTransfer.value = 5000.01;

                const res = await request(app)
                    .post('/transfers')
                    .set('Authorization', `Bearer ${token}`)
                    .send(reqTransfer);

                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error', 'Transferência acima de R$ 5.000,00 só para favorecidos');
            });
        })

        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "isabelle",
                    value: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        });

        it('Usando Mocks: Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            // Mocar apenas a função transfer do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'));

            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "priscila",
                    value: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
        });

        it('Usando Mocks: Quando informo valores válidos eu tenho sucesso com 201 CREATED', async () => {
            // Mocar apenas a função transfer do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({
                from: "julio",
                to: "priscila",
                value: 100,
                date: new Date().toISOString()
            });

            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "priscilaaaaaaaaaaa",
                    value: 100
                });

            expect(resposta.status).to.equal(201);

            // Validação com um Fixture
            const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidosEuTenhoSucessoCom201Created.json')
            delete resposta.body.date;
            delete respostaEsperada.date;
            expect(resposta.body).to.deep.equal(respostaEsperada);

            // Um expect para comparar a Resposta.body com a String contida no arquivo
            // expect(resposta.body).to.have.property('from', 'julio');
            // expect(resposta.body).to.have.property('to', 'priscila');
            // expect(resposta.body).to.have.property('value', 100);
        });

        afterEach(() => {
            // Reseto o Mock
            sinon.restore();
        })
    });

    describe('GET /transfers', () => {
        // Its ficam aqui
    });
});
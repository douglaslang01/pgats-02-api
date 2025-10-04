// Bibliotecas
const request = require('supertest');

//Aplicação
const app = require('../../app');

const postTransfer = async (token, bodyTransfer) =>
    await request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-type', 'application/json')
        .send(bodyTransfer);

const getTransfers = async (token) =>
    await request(app)
        .get('/transfers')
        .set('Authorization', `Bearer ${token}`)
        .send();


const populateTransfers = async (token) => {
    const listTransfers = []; //Buscar as trasnferencias das fixtures
    let transfersResult = [];

    listTransfers.forEach(async transfer => {
        const res = await postTransfer(token, transfer);

        if (res.status == 201) {
            transfersResult.push(res.body);
        }
    });

    return listTransfers;
}

module.exports = { postTransfer, getTransfers, populateTransfers }
// Bibliotecas
import http from 'k6/http';
import { check, sleep } from 'k6';

// Aplicação
const app = require('../../../../app');
const { getToken } = require('../helpers/authentication')

export const options = {
    iterations: 1
};

export default function () {

    const token = getToken();
    const url = app + '/transfers';
    const payload = JSON.stringify({
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };

    let res = http.post(url, payload, params);

    check(res, {
        'Validar que o Status é 201': (r) => r.status === 201,
    });

    sleep(1);
} 
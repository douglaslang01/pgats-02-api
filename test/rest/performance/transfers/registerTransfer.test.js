// Bibliotecas
import http from 'k6/http';
import { check, sleep } from 'k6';

// Aplicação
import { getToken } from '../../helpers/performanceAuthentication.js';
import { getBaseUrl } from '../../../utils/performance.js';
const postTransfer = JSON.parse(open('../../fixture/requisicoes/transferencias/postTransfer.json'));

export const options = {
    iterations: 1
};

export default function () {
    const token = getToken();
    const url = getBaseUrl() + '/transfers';
    const payload = JSON.stringify(postTransfer);

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
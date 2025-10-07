// Bibliotecas
import { check, sleep } from 'k6';

// Aplicação
import { getToken } from '../../helpers/performanceAuthentication.js';
import { registerUser, registerTransfer } from '../../../utils/performance.js';
const postTransfer = JSON.parse(open('../../fixture/requisicoes/transferencias/postTransfer.json'));

export const options = {
    stages: [
        { duration: '15s', target: 150 },
        { duration: '25s', target: 150 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<100'], // 95% of requests should be below 100ms
    }
    //iterations: 2
};

export function setup() {
    const token = getToken();
    const fromUser = registerUser();

    return { token: token, fromUser: fromUser }
}

export default function (data) {
    const token = data.token;

    postTransfer.from = data.fromUser;
    postTransfer.value = 1;

    const res = registerTransfer(token, postTransfer);

    check(res, {
        'Validar que o Status é 201': (r) => r.status === 201,
    });

    sleep(1);
} 
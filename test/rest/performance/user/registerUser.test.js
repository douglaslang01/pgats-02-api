import { check, sleep } from 'k6';
import { registerUser } from '../../../utils/performance.js';

export const options = {
    stages: [
        { duration: '15s', target: 100 },
        { duration: '25s', target: 100 },
        { duration: '10s', target: 0 }
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
    },
};

export default function () {
    const newUser = registerUser(); // retorna diretamente o campo 'username' do JSON

    check(newUser, {
        'Usuário registrado com sucesso': (u) => typeof u === 'string' && u.length > 0,
    });

    sleep(1);
}

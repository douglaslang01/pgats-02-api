import { check, sleep } from 'k6';
import { registerUser } from '../../../utils/performance.js';

export const options = {
    stages: [
        { duration: '15s', target: 100 },
        { duration: '25s', target: 30 },
        {duration: '10s', target: 30}
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<100'],
    }
};

export function setup() {
    const newUser = registerUser(); 
    return { newUser };
}

// teste principal
export default function (data) {
    const { newUser } = data;

    check({ username: newUser }, {
        'Usuário registrado com sucesso': (r) => r.username !== undefined
    });

    sleep(1);
}

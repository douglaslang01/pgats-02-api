import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 50, 
    duration: '10s', 
    thresholds: {
        http_req_duration: ['p(95)<2000'], 
    },
};

const BASE_URL = 'http://localhost:3000';
const TOKEN = 'SEU_TOKEN_JWT_AQUI'; 

export default function () {
    const res = http.get(`${BASE_URL}/transfers`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is array': (r) => {
            try {
                return Array.isArray(JSON.parse(r.body));
            } catch {
                return false;
            }
        },
        'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    sleep(1);
}
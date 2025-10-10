import http from 'k6/http';
import { check, sleep } from 'k6';

import { getToken } from '../../helpers/performanceAuthentication.js';
import { getBaseUrl } from '../../../utils/performance.js';

export let options = {
    vus: 50,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<2000'],
    },
};

export function setup() {
    const token = getToken();

    return { token: token }
}

export default function (data) {

    const url = getBaseUrl() + '/transfers';

    const params = {
        headers: {
            'Authorization': `Bearer ${data.token}`
        },
    };

    const res = http.get(url, params);

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

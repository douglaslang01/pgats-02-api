import http from 'k6/http';
import { getBaseUrl } from '../../utils/performance.js';
const postLogin = JSON.parse(open('../fixture/requisicoes/login/postLogin.json'));

export function getToken() {
    const url = getBaseUrl() + '/users/login';

    const payload = JSON.stringify(postLogin);

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(url, payload, params);

    return response.json('token');
}
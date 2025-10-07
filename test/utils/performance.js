import http from 'k6/http';
import { Faker } from "k6/x/faker";

const postUser = JSON.parse(open('../rest/fixture/requisicoes/usuario/postUser.json'));
const configLocal = JSON.parse(open('../config/config.local.json'));

const faker = new Faker();

function getBaseUrl() {
    return __ENV.BASE_URL || configLocal.baseUrl;
}

function registerUser() {
    const url = getBaseUrl() + '/users/register';
    postUser.username = faker.internet.username();
    const payload = JSON.stringify(postUser);

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(url, payload, params);

    return response.json('username');
}


export { getBaseUrl, registerUser }
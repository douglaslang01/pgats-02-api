import http from 'k6/http';
import { sleep, check } from 'k6';


export const options = {
    iterations: 1,
    thresholds: {
        http_req_duration: ['p(95)<22', 'max<25'], // 95% das requisições devem ser respondidas em menos de 25ms
        http_req_failed: ['rate<0.01'] // taxa de erro deve ser menor que 1%
    }
};

export default function () {
    const url = 'http://localhost:3000/users/login';

    const payload = JSON.stringify({//com essa função o objeto js vai ser transformado em JSON
        username: 'julio',
        password: '123456',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const resposta = http.post(url, payload, params);

    console.log(resposta.body);

    check(resposta, {
        'Validar que o status é 200': (r) => r.status === 200,
        'Validar que o token é string': (r) => typeof(r.json().token) === 'string',
        
    });


    sleep(1);
}
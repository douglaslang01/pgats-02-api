import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,           // Número de usuários virtuais simultâneos
  duration: '50s',     // Tempo total do teste
};

export default function () {
  const res = http.get('http://localhost:3000/users');

  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}

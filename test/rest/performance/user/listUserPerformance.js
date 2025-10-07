import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,           // número de usuários simultâneos
  duration: '50s',    // duração total do teste
};

let respostaEsperada = null;

export default function () {
  const res = http.get('http://localhost:3000/users');

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  // Captura a primeira resposta como referência
  if (__VU === 1 && __ITER === 0) {
    respostaEsperada = res.body;
  }

  // Verifica se os dados são consistentes com a primeira resposta
  if (respostaEsperada !== null) {
    check(res, {
      'dados são consistentes': (r) => r.body === respostaEsperada,
    });
  }
}
Feature: Listar transferências bancárias via API
        Given correntista
        When Quero visualizar as transferências de valores realizadas entre contas de outros clientes
        Then Para não ter que sair de casa e solicitar um extrato no banco

    Scenario: CT6.1 - Sucesso ao listar transferências
        When envio uma requisição GET para /transfers com um JWT válido
        Then a resposta deve ser 200 OK
        And deve retornar uma lista de transferências no formato JSON

    Scenario: CT6.2 - Falha ao listar transferências sem autenticação
        When envio uma requisição GET para /transfers sem o header Authorization
        Then a resposta deve ser 401 Unauthorized
        And a mensagem deve indicar autenticação obrigatória

    Scenario: CT6.3 - Falha ao listar transferências com token inválido
        When envio uma requisição GET para /transfers com um JWT inválido
        Then a resposta deve ser 403 Forbidden ou 401 Unauthorized
        And a mensagem deve indicar token inválido

    Scenario: CT6.4 - Validação do formato dos dados retornados
        When envio uma requisição GET para /transfers com autenticação válida
        Then cada item da resposta deve conter os campos from, to, value e date

    Scenario: CT6.5 - Endpoint inexistente
        When envio uma requisição GET para /transferencias
        Then a resposta deve ser 404 Not Found

    Scenario: CT6.6 - Método não permitido
        When envio uma requisição POST para /transfers
        Then a resposta deve ser 405 Method Not Allowed

    Scenario: CT6.7 - Performance com grande volume de dados
        Given existe um grande volume de transferências cadastradas
        When envio uma requisição GET para /transfers com autenticação válida
        Then o tempo de resposta deve ser menor que 2 segundos

    Scenario: CT6.8 - Concorrência de requisições
        When envio múltiplas requisições GET simultâneas para /transfers com autenticação válida
        Then todas as respostas devem ser consistentes e dentro do tempo esperado
    
    
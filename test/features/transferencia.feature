Feature: Transferências bancárias via API
        Given correntista
        When Quero fazer transferência de valores entre contas de outros clientes
        Then Para não ter que sair de casa para realizar esta ação

    Rule: Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.
    Rule: O saldo inicial de cada usuário é de R$ 10.000,00.
        @focus
        Scenario: CT5.1 - Transferência de R$ 5.000,00 para não favorecido deve retornar 201
            Given que o usuário "julio" está autenticado
            And possui saldo 5000.00 ou mais
            And "isabele" esteja cadastrada no sistema
            And "isabele" não é favorecida de "julio"
            When ele realiza uma transferência de 5000.00 para "isabelle"
            Then a API deve retornar status 201
            And a mensagem de sucesso deve ser exibida

        Scenario: CT5.2 - Transferência de R$ 5.000,01 para não favorecido deve retornar 400
            Given que o usuário "julio" está autenticado
            And "isabele" esteja cadastrada no sistema
            And "isabele" não é favorecida de "julio"
            When ele realiza uma transferência de 5000.01 para "isabelle"
            Then a API deve retornar status 400
            And a mensagem deve ser "Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos."

        Scenario: CT5.3 - Transferência de R$ 5.000,01 para favorecido deve retornar 201
            Given que o usuário "julio" está autenticado
            And possui saldo 5000.01 ou mais
            And "isabele" esteja cadastrada no sistema
            And "isabele" é favorecida de "julio"
            When ele realiza uma transferência de 5000.01 para "priscila"
            Then a API deve retornar status 201
            And a mensagem de sucesso deve ser exibida

        Scenario: CT5.4 - Transferência sem autenticação deve retornar 401
            Given que o usuário "julio" não está autenticado
            And possui saldo 100.00 ou mais
            And "isabele" esteja cadastrada no sistema
            When ele realiza uma transferência de 100 para "isabelle"
            Then a API deve retornar status 401
            And a mensagem deve ser "Token de autenticação ausente ou inválido."

        Scenario: CT5.5 - Transferência para usuário inexistente deve retornar 400
            Given que o usuário "julio" está autenticado
            And possui saldo 100.00 ou mais
            And "isabele" não esteja cadastrada no sistema
            When realiza uma transferência de 100 para "isabelle"
            And não seleciona quem está enviando a transferência
            Then a API deve retornar status 400
            And a mensagem deve ser "Usuário remetente ou destinatário não encontrado."

        Scenario: CT5.6 - Transferência com valor maior que o saldo deve retornar 400
            Given que o usuário "julio" está autenticado
            And possui saldo de 10000
            And "isabele" esteja cadastrada no sistema
            And "isabele" é favorecida de "julio"
            When ele realiza uma transferência de 10000.01 para "isabelle"
            Then a API deve retornar status 400
            And a mensagem deve ser "Saldo insuficiente para realizar a transferência."

        Scenario: CT5.7 - Transferência com valor negativo deve retornar 400
            Given que o usuário "julio" está autenticado
            And possui saldo de 10000
            And "isabele" esteja cadastrada no sistema
            When ele realiza uma transferência de -0.01 para "isabelle"
            Then a API deve retornar status 400

        Scenario: CT5.8 - Transferência com valor inválido deve retornar 400
            Given que o usuário "julio" está autenticado
            And possui saldo de 5000 ou mais
            And "isabele" esteja cadastrada no sistema
            When ele realiza uma transferência de "cinco mil" para "isabelle"
            Then a API deve retornar status 400
            And a mensagem deve ser "Valor da transferência inválido."

        Scenario: CT5.9 - Transferências simultâneas (concorrência) devem ser processadas sem inconsistências
            Given que o usuário "julio" está autenticado
            And possui saldo de 10000
            And "isabele" esteja cadastrada no sistema
            When ele realiza 100 múltiplas transferências de 100 para "isabelle" simultaneamente
            Then todas as transferências devem ser processadas corretamente, sem inconsistências

        Scenario: CT5.10 - Tempo de resposta da transferência deve ser menor que 2 segundos
            Given que o usuário "julio" está autenticado
            And possui saldo de 10000
            And "isabele" esteja cadastrada no sistema
            When ele realiza uma transferência de 100 para "isabelle"
            Then o tempo de resposta da API deve ser menor que 2 segundos
Feature: Transferências bancárias via API
        Given correntista
        When Quero fazer transferência de valores entre contas de outros clientes
        Then Para não ter que sair de casa para realizar esta ação

    Rule: Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.
    Rule: O saldo inicial de cada usuário é de R$ 10.000,00.

        Scenario: CT5.1 - Transferência de R$ 5.000,00 para não favorecido
            Given que o usuário "julio" está autenticado
            When ele realiza uma transferência de 5000.00 para "isabelle"
            Then a API deve retornar status 201
            And a mensagem de sucesso deve ser exibida

        Scenario: CT5.2 - Transferência de R$ 5.000,01 para não favorecido
            Given que o usuário "julio" está autenticado
            When ele realiza uma transferência de 5000.01 para "isabelle"
            Then a API deve retornar status 400
            And a mensagem deve ser "Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos."

        Scenario: CT5.3 - Transferência de R$ 5.000,01 para favorecido
            Given que o usuário "julio" está autenticado
            When ele realiza uma transferência de 5000.01 para "priscila"
            Then a API deve retornar status 201
            And a mensagem de sucesso deve ser exibida

        Scenario: CT5.4 - Transferência sem autenticação
            Given que o usuário "julio" não está autenticado
            When ele realiza uma transferência de 7000 para "isabelle"
            Then a API deve retornar status 401
            And a mensagem deve ser "Token de autenticação ausente ou inválido."

        Scenario: CT5.5 - Transferência com usuário inexistente
            Given que o usuário "usuarioInexistente" está autenticado
            When ele realiza uma transferência de 100 para "isabelle"
            Then a API deve retornar status 400
            And a mensagem deve ser "Usuário remetente ou destinatário não encontrado."

        Scenario: CT5.6 - Transferência com valor maior que o saldo
            Given que o usuário "julio" está autenticado e possui saldo de 10000
            When ele realiza uma transferência de 10000.01 para "isabelle"
            Then a API deve retornar status 400
            And a mensagem deve ser "Saldo insuficiente para realizar a transferência."

        Scenario: CT5.7 - Transferência com valor inválido
            Given que o usuário "julio" está autenticado
            When ele realiza uma transferência de "cinco mil" para "isabelle"
            Then a API deve retornar status 400
            And a mensagem deve ser "Valor da transferência inválido."

        Scenario: CT5.8 - Transferências simultâneas (concorrência)
            Given que o usuário "julio" está autenticado
            When ele realiza múltiplas transferências de 100 para "isabelle" simultaneamente
            Then todas as transferências devem ser processadas corretamente, sem inconsistências

        Scenario: CT5.9 - Tempo de resposta da transferência
            Given que o usuário "julio" está autenticado
            When ele realiza uma transferência de 100 para "isabelle"
            Then o tempo de resposta da API deve ser menor que 2 segundos


Feature: Registro de usuários via API
    Como novo usuário
    Quero me registrar na plataforma
    Para acessar funcionalidades de transferências e consultas

    Rule: Não é permitido registrar usuários duplicados.
    Rule: O saldo inicial de cada usuário é de R$ 10.000,00.

        Scenario: CT-2.1 - Registro de usuário válido
            Given que o usuário não está cadastrado
            When realiza o registro com dados válidos
            Then a API deve retornar status 201
            And o saldo inicial do usuário deve ser de R$ 10.000,00

        Scenario:  CT-2.2 - Registro de usuário sem favorecidos
            Given que o usuário não está cadastrado
            When realiza o registro com dados válidos sem informar favorecidos
            Then a API deve retornar status 201
            And o saldo inicial do usuário deve ser de R$ 10.000,00

        Scenario: CT-2.3 - Registro com username vazio
            When realiza o registro com username vazio
            Then a API deve retornar status 400
            And a mensagem de erro deve ser exibida

        Scenario: CT-2.4 - Registro com password vazio
            When realiza o registro com password vazio
            Then a API deve retornar status 400
            And a mensagem de erro deve ser exibida

        Scenario: CT-2.5 - Registro de usuário duplicado
            Given que o usuário já está cadastrado
            When realiza o registro novamente com os mesmos dados
            Then a API deve retornar status 400
            And a mensagem de erro deve ser exibida

        Scenario: CT-2.6 - Registro com favorecidos inválidos
            When realiza o registro com favorecidos inválidos
            Then a API deve retornar status 400
            And a mensagem de erro deve ser exibida

        Scenario: CT-2.7 - Registro sem username e password
            When realiza o registro sem informar username e password
            Then a API deve retornar status 400
            And a mensagem de erro deve ser exibida

        Scenario: CT-2.8 - Registro usando verbo não permitido
            When tenta registrar usuário usando verbo não permitido
            Then a API deve retornar status 404
            And a mensagem de erro deve ser exibida

        Scenario: CT-2.9 - Registro concorrente de múltiplos usuários
            Given que múltiplos usuários não estão cadastrados
            When são realizados registros simultâneos de usuários únicos e duplicados
            Then a API deve retornar 201 para usuários únicos e 400 para duplicados
            And cada usuário criado deve ter saldo inicial de R$ 10.000,00

        Scenario: CT-2.10 - Tempo de resposta do registro deve ser menor que 2 segundos
            Given que o usuário não está cadastrado
            When realiza o registro com dados válidos
            Then o tempo de resposta da API deve ser menor que 2 segundos

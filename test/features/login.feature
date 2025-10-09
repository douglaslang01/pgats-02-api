Feature: Login de usuários
  Background: Avaliação do endpoint POST /users/login

  Scenario: Login com usuário e senha válidos
    Given que exista um usuário com username "julio" e password "123456"
    When eu faço um POST para "/users/login" com o corpo:
      | username | 'julio'  |
      | password | '123456' |
    Then a resposta deve ter status 200
    And a resposta deve conter um token válido

  Scenario: Login com senha incorreta
    Given que exista um usuário com username "teste" e password "123456"
    When eu faço um POST para "/users/login" com o corpo:
      | username | 'teste'  |
      | password | '1234567' |
    Then a resposta deve ter status 400

  Scenario: Login com username numérico (tipo inválido)
    When eu faço um POST para "/users/login" com o corpo:
      | username | 123 |
      | password | '123456' |
    Then a resposta deve ter status 400


  Scenario: Login com senha inválida (formato incorreto)
    Given que exista um usuário com username "julio" e password "123456"
    When eu faço um POST para "/users/login" com o corpo:
      | username | 'julio'  |
      | password | '1234567' |
    Then a resposta deve ter status 400

  Scenario: Login com password numérico (tipo inválido)
    When eu faço um POST para "/users/login" com o corpo:
      | username | 'julio' |
      | password | 123 |
    Then a resposta deve ter status 400

  Scenario: Login com username vazio
    When eu faço um POST para "/users/login" com o corpo:
      | username |          |
      | password | '123456' |
    Then a resposta deve ter status 400

  Scenario: Login sem campo password
    When eu faço um POST para "/users/login" com o corpo:
      | username | 'julio' |
    Then a resposta deve ter status 400

  Scenario: Login sem campo username
    When eu faço um POST para "/users/login" com o corpo:
      | password | '123456'|
    Then a resposta deve ter status 400

  Scenario: Login com corpo vazio
    When eu faço um POST para "/users/login" com o corpo vazio
    Then a resposta deve ter status 400

  Scenario: Teste de carga - múltiplas requisições válidas simultâneas
    When eu executo 200 requests paralelos POST para "/users/login" com corpo válido
    Then todas as respostas devem retornar status 200
    And o tempo médio de resposta deve ser aceitável (ex.: < 4000ms)

  Scenario: Teste de carga - múltiplas requisições inválidas simultâneas
    When eu executo 200 requests paralelos POST para "/users/login" com corpos inválidos
    Then todas as respostas devem retornar status 400 rapidamente


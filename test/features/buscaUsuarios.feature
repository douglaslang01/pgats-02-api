Feature: Mostrar lista de usuários (GET /users)
  Como cliente da API de usuários
  Eu quero obter a lista de usuários cadastrados
  Para obter os campos username, favorecidos e saldo
  
  # 1. Verifica se a resposta contém uma lista de usuários em formato JSON com os campos corretos e retorna status 200 ok.
  Scenario: Retorno bem-sucedido com status 200 e campos esperados
    Given que a API está disponível
    When eu envio uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And o corpo da resposta deve conter uma lista de usuários em formato JSON de usuários
    And cada usuário deve conter os campos "username", "favorecidos" e "saldo"
  
  # 2. Verifica se a tipagem correta dos campos estão corretas.
  Scenario: Cada objeto usuário possui os tipos corretos
    Given que a API está disponível
    When eu envio uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And todo item no array de usuários retornado DEVERÁ ter:
      | campo       | tipo    |
      | username    | string  |
      | favorecidos | array   |
      | saldo       | number  |

  # 3. Não deve haver usuários duplicados
  Scenario: Não existem usernames duplicados na resposta
    Given que a API está disponível
    When eu envio uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And NÃO DEVERÁ haver valores duplicados no campo `username`

  # 4. Tempo de resposta aceitável para até 1000 usuários
  Scenario: Tempo de resposta aceitável para até 1000 usuários
    Given que existem até 1000 usuários cadastrados 
    When eu envio uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And o tempo de resposta DEVERÁ ser < 1000ms

  # 5. Consistência em requisições simultâneas
  Scenario: Requisições simultâneas retornam dados consistentes
    Given que a API está disponível
    When emúltiplas requisições GET para /users são enviadas simultaneamente
    Then todas as respostas devem ter status 200 OK
    And todas as respostas DEVERÃO ter o mesmo formato e conteúdo esperado (campos previstos; valores consistentes após normalização)
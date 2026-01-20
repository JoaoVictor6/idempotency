Seja meu especialista devops.

Preciso criar a infraestrtura necessaria para rodar o meu serverless. nele utilizamos redis e postgress. 

preciso que voce me ajdue a configurar a infraestrtura necessaria pra conectar essas pontas.

### Base
Configure um IAM paraconfigurar nossa infra

### Rede
Precisamos:
- 1 VPC
- Duas subnets
    - Uma publica para o lambda
    - Uma privada para a instancia do redis e postgres
- 1 security group para permitir o lambda falar com o redis e o postgres

### Banco
- 1 instancia micro do RDS com postgres
- 1 RDS proxy. estamos trabalhnado com uma api lambda, nao existe pool de conexoes funcional entro de um container
- 1 instancia micro aws elastic cache

### Variaveis de ambiente
- 1 simples SSM com nosas envs configuradas

----

PReciso que voce me ajdue a refinar esses pontos. sobre o banco de dados e redis. me ajdue a entender as alternativas dentro da aws

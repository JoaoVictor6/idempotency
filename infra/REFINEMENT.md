# Refinamento da Arquitetura AWS para a Aplicação Serverless

Este documento descreve a arquitetura de infraestrutura como código (IaC) a ser implementada com Terraform para suportar a aplicação.

### 1. Rede (VPC)

- **VPC:** 1 VPC para isolar os recursos da aplicação.
- **Subnets:**
    - **1x Subnet Pública:** Hospedará o **NAT Gateway**. Terá uma rota para um **Internet Gateway** para permitir o acesso à internet.
    - **1x Subnet Privada:** Hospedará a **função Lambda**, a instância **RDS** e o cluster **ElastiCache**. A Lambda aqui terá acesso aos serviços na mesma subnet e, para acessar a internet (ex: APIs de terceiros), usará o NAT Gateway.
- **Gateways:**
    - **Internet Gateway:** Anexado à VPC e associado à subnet pública.
    - **NAT Gateway:** Localizado na subnet pública para prover acesso à internet para os recursos na subnet privada.
- **Security Groups:**
    - **SG Lambda:** Security Group para a função Lambda.
    - **SG Data:** Security Group para o RDS e ElastiCache. Ele terá regras de *ingress* (entrada) permitindo tráfego vindo do `SG Lambda` nas seguintes portas:
        - **PostgreSQL (RDS):** Porta `5432`
        - **Redis (ElastiCache):** Porta `6379`

### 2. Banco de Dados e Cache

- **AWS RDS:**
    - **Instância:** `db.t4g.micro` com PostgreSQL.
    - **RDS Proxy:** Será criado para gerenciar o pool de conexões entre o Lambda e o RDS de forma eficiente.
- **AWS ElastiCache:**
    - **Instância:** `cache.t4g.micro` com Redis para atuar como cache e para o gerenciamento de idempotência.

### 3. IAM (Identity and Access Management)

- **IAM Role (Lambda):** Uma role será criada para a função Lambda, concedendo as permissões necessárias para:
    - Executar e escrever logs no CloudWatch.
    - Acessar o RDS Proxy.
    - Acessar o cluster ElastiCache.
    - Ler parâmetros do SSM Parameter Store.

### 4. Gerenciamento de Configuração

- **AWS SSM Parameter Store:** Utilizado para armazenar de forma segura as variáveis de ambiente, como a string de conexão do banco de dados, o host do Redis e outras configurações sensíveis.

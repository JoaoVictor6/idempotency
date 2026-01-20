locals {
  tags = {
    Project = var.project_name
    Env     = var.env
    Billing = "idempotency-study"
  }
}

# --- Subnet Groups ---
resource "aws_db_subnet_group" "default" {
  name       = "${var.project_name}-${var.env}-rds-sng"
  subnet_ids = var.private_subnet_ids

  tags = local.tags
}

resource "aws_elasticache_subnet_group" "default" {
  name       = "${var.project_name}-${var.env}-redis-sng"
  subnet_ids = var.private_subnet_ids

  tags = local.tags
}

# --- Database ---
resource "aws_db_instance" "default" {
  identifier           = "${var.project_name}-${var.env}-db"
  instance_class       = "db.t4g.micro"
  engine               = "postgres"
  engine_version       = "15.15"
  allocated_storage    = 20
  storage_type         = "gp2"
  username             = var.db_username
  password             = var.db_password
  db_name              = var.db_name
  db_subnet_group_name = aws_db_subnet_group.default.name
  vpc_security_group_ids = [var.data_sg_id]
  skip_final_snapshot  = true
  publicly_accessible  = false

  tags = local.tags
}

# --- Cache ---
resource "aws_elasticache_cluster" "default" {
  cluster_id           = "${var.project_name}-${var.env}-redis"
  engine               = "redis"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.default.name
  security_group_ids   = [var.data_sg_id]

  tags = local.tags
}

# --- RDS Proxy ---
resource "aws_secretsmanager_secret" "db_creds" {
  name = "${var.project_name}-${var.env}/rds-credentials"
  recovery_window_in_days = 0 # Not recommended for production
}

resource "aws_secretsmanager_secret_version" "db_creds" {
  secret_id = aws_secretsmanager_secret.db_creds.id
  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
  })
}

resource "aws_iam_role" "proxy_role" {
  name = "${var.project_name}-${var.env}-rds-proxy-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "rds.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "proxy_secrets_attachment" {
  role       = aws_iam_role.proxy_role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

resource "aws_db_proxy" "default" {
  name                   = "${var.project_name}-${var.env}-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = false
  role_arn               = aws_iam_role.proxy_role.arn
  vpc_security_group_ids = [var.data_sg_id]
  vpc_subnet_ids         = var.private_subnet_ids

  auth {
    auth_scheme = "SECRETS"
    iam_auth    = "DISABLED"
    secret_arn  = aws_secretsmanager_secret.db_creds.arn
  }

  tags = local.tags
}

resource "aws_db_proxy_default_target_group" "default" {
  db_proxy_name = aws_db_proxy.default.name
  
  connection_pool_config {
    connection_borrow_timeout    = 120
    max_connections_percent      = 100
    max_idle_connections_percent = 50
  }
}

resource "aws_db_proxy_target" "default" {
  db_instance_identifier = aws_db_instance.default.identifier
  db_proxy_name          = aws_db_proxy.default.name
  target_group_name      = aws_db_proxy_default_target_group.default.name
}

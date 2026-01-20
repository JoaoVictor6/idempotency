locals {
  tags = {
    Project = var.project_name
    Env     = var.env
    Billing = "idempotency-study"
  }
}

# --- VPC Config for Serverless ---
resource "aws_ssm_parameter" "private_subnet_ids" {
  name        = "/${var.project_name}/${var.env}/PRIVATE_SUBNET_IDS"
  type        = "String"
  value       = join(",", var.private_subnet_ids)
  description = "Comma-separated list of private subnet IDs for Lambda VPC config"
  tags        = local.tags
}

resource "aws_ssm_parameter" "data_sg_id" {
  name        = "/${var.project_name}/${var.env}/DATA_SG_ID"
  type        = "String"
  value       = var.data_sg_id
  description = "Security Group ID for Lambda VPC config"
  tags        = local.tags
}

# --- App Config ---
resource "aws_ssm_parameter" "redis_host" {
  name        = "/${var.project_name}/${var.env}/REDIS_HOST"
  type        = "String"
  value       = var.redis_host
  description = "Redis host for ${var.project_name} ${var.env}"
  tags        = local.tags
}

resource "aws_ssm_parameter" "redis_port" {
  name        = "/${var.project_name}/${var.env}/REDIS_PORT"
  type        = "String" # SSM stores numbers as strings
  value       = tostring(var.redis_port)
  description = "Redis port for ${var.project_name} ${var.env}"
  tags        = local.tags
}

resource "aws_ssm_parameter" "db_host" {
  name        = "/${var.project_name}/${var.env}/DB_HOST"
  type        = "String"
  value       = var.db_proxy_host
  description = "Database proxy host for ${var.project_name} ${var.env}"
  tags        = local.tags
}

resource "aws_ssm_parameter" "db_creds_secret_arn" {
  name        = "/${var.project_name}/${var.env}/DB_CREDS_SECRET_ARN"
  type        = "String"
  value       = var.db_creds_secret_arn
  description = "ARN of the Secrets Manager secret for DB credentials for ${var.project_name} ${var.env}"
  tags        = local.tags
}

# The DB_USER and DB_DATABASE can be set as static values or passed from the data module if they were output.
# For simplicity and consistency with the provided envs, we'll use static values here,
# assuming they are part of the application's expected configuration.
# If these were dynamic, they would come from variables passed to this module.
resource "aws_ssm_parameter" "db_user" {
  name        = "/${var.project_name}/${var.env}/DB_USER"
  type        = "String"
  value       = "postgres" # Based on the provided envs
  description = "Database user for ${var.project_name} ${var.env}"
  tags        = local.tags
}

resource "aws_ssm_parameter" "db_database" {
  name        = "/${var.project_name}/${var.env}/DB_DATABASE"
  type        = "String"
  value       = "idempotency_db" # Based on the provided envs
  description = "Database name for ${var.project_name} ${var.env}"
  tags        = local.tags
}

resource "aws_ssm_parameter" "db_client" {
  name        = "/${var.project_name}/${var.env}/DB_CLIENT"
  type        = "String"
  value       = "pg" # Based on the provided envs
  description = "Database client type for ${var.project_name} ${var.env}"
  tags        = local.tags
}

resource "aws_ssm_parameter" "db_port" {
  name        = "/${var.project_name}/${var.env}/DB_PORT"
  type        = "String"
  value       = "5432" # Based on the provided envs
  description = "Database port for ${var.project_name} ${var.env}"
  tags        = local.tags
}

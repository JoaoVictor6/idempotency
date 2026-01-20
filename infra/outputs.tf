output "vpc_id" {
  description = "The ID of the VPC."
  value       = module.network.vpc_id
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets."
  value       = module.network.private_subnet_ids
}

output "lambda_sg_id" {
  description = "The ID of the Lambda security group."
  value       = module.network.lambda_sg_id
}

output "data_sg_id" {
  description = "The ID of the data security group."
  value       = module.network.data_sg_id
}

output "redis_host" {
  description = "The hostname of the Redis cluster."
  value       = module.data.redis_host
}

output "redis_port" {
  description = "The port of the Redis cluster."
  value       = module.data.redis_port
}

output "db_proxy_host" {
  description = "The hostname of the RDS Proxy."
  value       = module.data.db_proxy_host
}

output "db_creds_secret_arn" {
  description = "The ARN of the secret containing the database credentials."
  value       = module.data.db_creds_secret_arn
}

output "redis_host" {
  description = "The hostname of the Redis cluster."
  value       = aws_elasticache_cluster.default.cache_nodes[0].address
}

output "redis_port" {
  description = "The port of the Redis cluster."
  value       = aws_elasticache_cluster.default.cache_nodes[0].port
}

output "db_proxy_host" {
  description = "The hostname of the RDS Proxy."
  value       = aws_db_proxy.default.endpoint
}

output "db_creds_secret_arn" {
  description = "The ARN of the secret containing the database credentials."
  value       = aws_secretsmanager_secret.db_creds.arn
}

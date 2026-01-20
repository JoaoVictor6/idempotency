variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "env" {
  description = "Environment name."
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for VPC configuration."
  type        = list(string)
}

variable "data_sg_id" {
  description = "The ID of the data security group for VPC configuration."
  type        = string
}

variable "redis_host" {
  description = "Hostname of the Redis cluster."
  type        = string
}

variable "redis_port" {
  description = "Port of the Redis cluster."
  type        = number
}

variable "db_proxy_host" {
  description = "Hostname of the RDS Proxy."
  type        = string
}

variable "db_creds_secret_arn" {
  description = "ARN of the secret containing database credentials."
  type        = string
}

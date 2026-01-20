variable "project_name" {
  description = "Name of the project."
  type        = string
  default     = "idempotency"
}

variable "env" {
  description = "Environment name."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for the infrastructure."
  type        = string
  default     = "us-east-1"
}

variable "db_password" {
  description = "Password for the RDS database. Will be passed to the data module."
  type        = string
  sensitive   = true
}

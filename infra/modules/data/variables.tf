variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "env" {
  description = "Environment name."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where resources will be created."
  type        = string
}

# The network module will create a subnet group for us.
variable "private_subnet_ids" {
  description = "A list of private subnet IDs for the RDS and ElastiCache resources."
  type        = list(string)
}

variable "data_sg_id" {
  description = "The ID of the security group for the data resources."
  type        = string
}

variable "db_name" {
  description = "The name of the database to create."
  type        = string
  default     = "idempotency_db"
}

variable "db_username" {
  description = "Username for the RDS database."
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Password for the RDS database. This should be passed securely."
  type        = string
  sensitive   = true
}

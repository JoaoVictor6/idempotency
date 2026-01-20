# Infrastructure

This folder contains the Terraform configuration for the project's AWS infrastructure.

## Architecture

The infrastructure is composed of the following modules:

- **Network**: Creates a VPC with public and private subnets, a NAT Gateway, and security groups for the Lambda functions and data resources.
- **Data**: Creates an RDS Postgres instance, an ElastiCache Redis cluster, and an RDS Proxy to manage database connections.
- **Config**: Creates SSM Parameters to store the configuration values for the application, such as database credentials and Redis connection details.

## Usage

To deploy the infrastructure, you will need to have Terraform installed and configured with your AWS credentials.

Then, run the following commands:

```bash
terraform init
terraform plan
terraform apply
```

## Inputs

The following input variables are available:

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| aws_region | The AWS region to deploy the infrastructure to. | `string` | `"us-east-1"` | no |
| project_name | The name of the project. | `string` | `"idempotency"` | no |
| env | The environment to deploy to. | `string` | `"dev"` | no |
| db_password | The password for the database. | `string` | n/a | yes |

## Outputs

The following outputs are available:

| Name | Description |
|------|-------------|
| lambda_sg_id | The ID of the Lambda security group. |
| data_sg_id | The ID of the data security group. |
| rds_instance_address | The address of the RDS instance. |
| redis_cluster_address | The address of the Redis cluster. |

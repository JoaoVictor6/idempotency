output "vpc_id" {
  description = "The ID of the VPC."
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets."
  value       = aws_subnet.private[*].id
}

output "lambda_sg_id" {
  description = "The ID of the Lambda security group."
  value       = aws_security_group.lambda.id
}

output "data_sg_id" {
  description = "The ID of the data security group."
  value       = aws_security_group.data.id
}

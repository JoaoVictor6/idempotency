terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "network" {
  source = "./modules/network"

  project_name = var.project_name
  env          = var.env
}

module "data" {
  source = "./modules/data"

  project_name       = var.project_name
  env                = var.env
  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  data_sg_id         = module.network.data_sg_id
  db_password        = var.db_password
}

module "config" {
  source = "./modules/config"

  project_name        = var.project_name
  env                 = var.env
  private_subnet_ids  = module.network.private_subnet_ids
  data_sg_id          = module.network.data_sg_id
  redis_host          = module.data.redis_host
  redis_port          = module.data.redis_port
  db_proxy_host       = module.data.db_proxy_host
  db_creds_secret_arn = module.data.db_creds_secret_arn
}
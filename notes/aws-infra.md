# Infrastructure in AWS to deploy with Terraform

## First architecture: deploying with EC2 auto-scaling, a load balancer and with MongoDB Atlas.

- VPC
- 2 public and 2 private subnets
- Two NAT gateways, one per public subnet
- Internet gateway
- Route table to route block 0.0.0.0/0 to the Internet Gateway and to the two public subnets
- Two route tables to route each NAT gateway to the private subnets
- Target group of instance type (without targets at first)
- Internet-facing ALB
  - Security group allowing inbound to HTTP:80
- S3 bucket to save the source code of the e-commerce API, which will be used by the instances as their user data.
- Launch template to deploy instances of the E-commerce API
- Auto-scaling group that uses the launch template and deploys two instances on the private subnets.

## Architecture V2: going serverless with Fargate on Elastic Container Service 
 
**Components:**

- VPC
- 2 public and 2 private subnets
- Internet-facing ALB for the Express server deployment
- ECR repository
- ECS cluster
- Service in the ECS cluster (apply with 0 instances)
- Task definition to deploy the Express server image

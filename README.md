# TCP Service with AWS CDK

## Get Started
This project creates a network stack to deploy resources inside a VPC with public and private subnets, natgateways, internet gateways.
It also deploys a CI/CD pipeline (CDK Pipeline) in AWS CodePipeline to deploy different TCP Services for Rust and GO servers.

To get started do:

```
git clone xxxx
cdk bootstrap
cdk deploy --all
```
This will deploy the POC-Network Stack and the PipelineStack in your account.

The PipelineStack deploys a repository in AWS CodeCommit. This repository triggers the pipeline.

Add your code to the pipeline:
```
git remote add codecommit <https endpoint, you can find it in the AWS Console>
git add .
git commit -m'First commit'
git push codecommit main
```

This will trigger the pipeline and deploy the TCP Services


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

Add your code to the repository:
```
git remote add codecommit <https endpoint, you can find it in the AWS Console>
git add .
git commit -m'First commit'
git push codecommit main
```

This will trigger the pipeline and deploy the TCP Services

After deployment you can go to CloudFormation and see the resources. You can also go to the EC2 console and look for the Network Load Balancers that were deployed.

## Modifying resources (Instance types, Architecturem, Server Logic)
You can add more or less TCP services in the lib/pipeline-stack.ts 

You have to instanciate a new TcpServiceStage as the example below. There you can modify the machineImage, instanceType, vpcId (vpc where the resources are deployed), serverFileName.

```
const deploy_6 = new TcpServiceStage(this, 'Deploy-C5-X86-Large-GO',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
                vpcId: vpcProps.vpcId,
                serverFileName: 'go-amd.sh',
            },
            {
                env: { region: "us-east-2", account: process.env.CDK_DEFAULT_ACCOUNT}
            });
```

You have to add or remove your new TcpServiceStage (deploy_6 in the above example) into the pipeline wave:

```
tcp_service_wave.addStage(deploy_0);
tcp_service_wave.addStage(deploy_1);
tcp_service_wave.addStage(deploy_2);
tcp_service_wave.addStage(deploy_3);
tcp_service_wave.addStage(deploy_4);
tcp_service_wave.addStage(deploy_5);
tcp_service_wave.addStage(deploy_6);
tcp_service_wave.addStage(deploy_7);
```

You can add your own server logic into the serverscripts/ directory and modifiy the serverFileName in the example above to your file name.
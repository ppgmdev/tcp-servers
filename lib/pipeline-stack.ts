import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines'
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { TcpServiceStage } from './tcpservice-pipeline-stage';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { NetworkStackStage } from './network-pipeline-stage';

interface vpc {
    vpc: ec2.IVpc,
}
export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const repo = new Repository(this, 'POC-repo', {
            repositoryName: 'POC-repo'
        })

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'POC-Pipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.codeCommit(repo, 'main'),
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            })
        })

        const deploy_network = new NetworkStackStage(this, 'NetworkStack', {env:{region:'us-east-2', account: '151244847490'}})

        const deploy_0 = new TcpServiceStage(this, 'Deploy-C6G-Large-Rust',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C6G, ec2.InstanceSize.LARGE),
                vpc: deploy_network.vpc,
            },
            {
                env: { region: "us-east-2", account: "151244847490" } 
            })

        const deploy_1 = new TcpServiceStage(this, 'Deploy-T3-Micro-Rust',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
                vpc: deploy_network.vpc,
            },
            {
                env: { region: "us-east-2", account: "151244847490" } 
            })

        const deploy_2 = new TcpServiceStage(this, 'Deploy-C5-Large-Rust',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
                vpc: deploy_network.vpc,
            },
            {
                env: { region: "us-east-2", account: "151244847490" } 
            })
        pipeline.addStage(deploy_network);
        pipeline.addStage(deploy_0);
        pipeline.addStage(deploy_1);
        pipeline.addStage(deploy_2);

        new cdk.CfnOutput(this, 'CodeCommitRepo-URL', {
            value: repo.repositoryCloneUrlHttp,
            description: 'Repository URL'
        })
    }
}
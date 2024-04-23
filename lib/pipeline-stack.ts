import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines'
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { TcpServiceStage } from './tcpservice-pipeline-stage';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { NetworkStackStage } from './network-pipeline-stage';

interface vpc {
    vpcId: string,
}
export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, vpcProps: vpc, props?: cdk.StackProps) {
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

        const deploy_0 = new TcpServiceStage(this, 'Deploy-R7G-Graviton-Large-Rust',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2023({cpuType: ec2.AmazonLinuxCpuType.ARM_64}),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.R7G, ec2.InstanceSize.LARGE),
                vpcId: vpcProps.vpcId,
            },
            {
                env: { region: "us-east-2", account: "151244847490" } 
            })

        const deploy_1 = new TcpServiceStage(this, 'Deploy-T3-X86-Large-Rust',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.LARGE),
                vpcId: vpcProps.vpcId,
            },
            {
                env: { region: "us-east-2", account: "151244847490" } 
            })

        const deploy_2 = new TcpServiceStage(this, 'Deploy-C5-X86-Large-Rust',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
                vpcId: vpcProps.vpcId,
            },
            {
                env: { region: "us-east-2", account: "151244847490" } 
            });

        const deploy_3 = new TcpServiceStage(this, 'Deploy-M7G-Graviton-Large-Rust',
            {
                machineImage: ec2.MachineImage.latestAmazonLinux2023({cpuType: ec2.AmazonLinuxCpuType.ARM_64}),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M7G, ec2.InstanceSize.LARGE),
                vpcId: vpcProps.vpcId,
            },
            {
                env: { region: "us-east-2", account: "151244847490" } 
            });

        const tcp_service_wave = pipeline.addWave('TCPServices');

        tcp_service_wave.addStage(deploy_0);
        tcp_service_wave.addStage(deploy_1);
        tcp_service_wave.addStage(deploy_2);
        tcp_service_wave.addStage(deploy_3);

        new cdk.CfnOutput(this, 'CodeCommitRepo-URL', {
            value: repo.repositoryCloneUrlHttp,
            description: 'Repository URL'
        })
    }
}
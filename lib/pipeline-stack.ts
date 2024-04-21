import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines'
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { TcpServiceStage } from './tcpservice-pipeline-stage';

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
                commands: ['npm ci', 'npm run build', 'npx aws-cdk synth']
            })
        })

        const deploy = new TcpServiceStage(this, 'Deploy')
        const deployStage = pipeline.addStage(deploy)
    }
}
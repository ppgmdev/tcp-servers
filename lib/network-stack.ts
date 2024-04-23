import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const vpc = new Vpc(this, 'POC-VPC');

        new cdk.CfnOutput(this, 'VPC-Output', {
            value: vpc.vpcId,
            exportName: 'vpcid',
            description: 'VPC ID'
        })
    }
}
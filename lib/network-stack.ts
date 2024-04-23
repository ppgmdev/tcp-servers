import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export class NetworkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const vpc = new Vpc(this, 'POC-VPC');

        new StringParameter(this, 'VPCID', {
            parameterName: '/VpcProvider/VPCID',
            stringValue: vpc.vpcId,
        })

        new cdk.CfnOutput(this, 'VPC-Output', {
            value: vpc.vpcId,
            exportName: 'vpcid',
            description: 'VPC ID'
        })
    }
}
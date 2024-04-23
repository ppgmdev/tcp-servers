import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './network-stack';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export class NetworkStackStage extends cdk.Stage {
    public readonly vpc: Vpc;
    constructor(scope: Construct, id: string, props?: cdk.StageProps){
        super(scope, id, props)

        const network = new NetworkStack(this, 'NetworkStack');
        this.vpc = network.vpc;
    }
}
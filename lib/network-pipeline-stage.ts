import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './network-stack';

export class NetworkStackStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps){
        super(scope, id, props)

        const network = new NetworkStack(this, 'NetworkStack')
    }
}
import { TcpHaServerStack } from "./tcp-ha-server-stack";
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface propsTCPservice{
    machineImage: ec2.IMachineImage,
    instanceType: ec2.InstanceType
    vpc: ec2.IVpc
}

export class TcpServiceStage extends Stage {
    constructor(scope: Construct, id: string, instanceConfig:propsTCPservice, props?: StageProps,) {
        super(scope, id, props);

        const tcpService = new TcpHaServerStack(this, 'TCPService', instanceConfig);
    }
}
import { TcpHaServerStack } from "./tcp-ha-server-stack";
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class TcpServiceStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const tcpService = new TcpHaServerStack(this, 'TCPService');
    }
}
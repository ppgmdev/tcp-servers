import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { Vpc } from 'aws-cdk-lib/aws-ec2'

export class TcpHaServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
    const vpc = new Vpc(this, 'POC-Vpc')
    const network_loadbalancer = new elbv2.NetworkLoadBalancer(this, 'POC-NetworkLoadBalancer', {vpc})
  }
}

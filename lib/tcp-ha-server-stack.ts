import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { InstanceTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets'

export class TcpHaServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'POC-Vpc')

    const instance1 = new ec2.Instance(this, 'Server1', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 })
    })

    const instance2 = new ec2.Instance(this, 'Server2', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 })
    })
    const network_loadbalancer = new elbv2.NetworkLoadBalancer(this, 'POC-NetworkLoadBalancer', { vpc, internetFacing: true });

    const listener = network_loadbalancer.addListener('listener', { port: 80 });

    listener.addTargets('ServerFleet', {
      port: 8080,
      targets: [new InstanceTarget(instance1), new InstanceTarget(instance2)]
    })

  }
}

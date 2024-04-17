import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { InstanceTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets'
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

export class TcpHaServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'POC-Vpc')

    const launchTemplate = new ec2.LaunchTemplate(this, 'POC-LaunchTemplate', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2()
    })
    const asg = new autoscaling.AutoScalingGroup(this, 'POC-AutoscalingGroup', {
      vpc,
      launchTemplate: launchTemplate,
      minCapacity: 2,
      maxCapacity: 4
    })

    const network_loadbalancer = new elbv2.NetworkLoadBalancer(this, 'POC-NetworkLoadBalancer', { vpc, internetFacing: true });

    const listener = network_loadbalancer.addListener('listener', { port: 80 });

    listener.addTargets('ServerFleet', {
      port: 8080,
      targets: [asg]
    })

  }
}

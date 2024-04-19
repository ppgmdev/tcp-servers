import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

export class TcpHaServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'POC-Vpc')
    
    const nlb_securitygroup = new ec2.SecurityGroup(this, 'POC-SecurityGroup-NLB', {
      vpc
    })

    const ec2_securitygroup = new ec2.SecurityGroup(this, 'POC-SecurityGroup-EC2', {
      vpc
    })

    const ec2_userdata = ec2.UserData.forLinux()
    ec2_userdata.addCommands(
      'echo Hello World'
    )
    const launchTemplate = new ec2.LaunchTemplate(this, 'POC-LaunchTemplate', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup: ec2_securitygroup,
      userData: ec2_userdata
    })

    const asg = new autoscaling.AutoScalingGroup(this, 'POC-AutoscalingGroup', {
      vpc,
      launchTemplate: launchTemplate,
      minCapacity: 2,
      maxCapacity: 4
    })

    const network_loadbalancer = new elbv2.NetworkLoadBalancer(this, 'POC-NetworkLoadBalancer', { vpc, internetFacing: true });

    nlb_securitygroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow traffic from the internet')

    ec2_securitygroup.addIngressRule(ec2.Peer.securityGroupId(nlb_securitygroup.securityGroupId), ec2.Port.tcp(8080), 'Allow traffic from port 8080')

    const listener = network_loadbalancer.addListener('listener', { port: 80 });

    listener.addTargets('ServerFleet', {
      port: 8080,
      targets: [asg]
    })

  }
}
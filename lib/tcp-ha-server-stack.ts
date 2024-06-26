import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

interface tcpHAprops {
  machineImage: ec2.IMachineImage,
  instanceType: ec2.InstanceType,
  vpcId: string,
  serverFileName: string,
}

export class TcpHaServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: tcpHAprops) {
    super(scope, id);

    const vpcId = StringParameter.valueFromLookup(this, '/VpcProvider/VPCID'); 
    const vpc = ec2.Vpc.fromLookup(this, "VPC",
      {
        vpcId: vpcId
      }
    );

    const nlb_securitygroup = new ec2.SecurityGroup(this, 'POC-SecurityGroup-NLB', {
      vpc
    })

    const asset = new Asset(this, 'Asset', {
      path: `./serverscripts/${props.serverFileName}`
    })

    const ec2_securitygroup = new ec2.SecurityGroup(this, 'POC-SecurityGroup-EC2', {
      vpc
    })

    const role = new Role(this, 'POC-ec2-role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      description: 'Role for ec2 poc'
    })

    const ec2_userdata = ec2.UserData.forLinux()
    ec2_userdata.addCommands(
      'echo Hello World'
    )

    const launchTemplate = new ec2.LaunchTemplate(this, 'POC-LaunchTemplate', {
      instanceType: props.instanceType,
      machineImage: props.machineImage,
      securityGroup: ec2_securitygroup,
      role: role,
    })

    const localPath = launchTemplate.userData?.addS3DownloadCommand({
      bucket: asset.bucket,
      bucketKey: asset.s3ObjectKey,
    })

    launchTemplate.userData?.addExecuteFileCommand({
      filePath: String(localPath),
    })


    if (launchTemplate.role) {
      asset.grantRead(launchTemplate.role);
    }

    const asg = new autoscaling.AutoScalingGroup(this, 'POC-AutoscalingGroup', {
      vpc,
      launchTemplate: launchTemplate,
      minCapacity: 2,
      maxCapacity: 4
    })

    const network_loadbalancer = new elbv2.NetworkLoadBalancer(this, 'POC-NetworkLoadBalancer', { vpc, internetFacing: true });

    network_loadbalancer.addSecurityGroup(nlb_securitygroup)

    nlb_securitygroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow traffic from the internet')

    ec2_securitygroup.addIngressRule(ec2.Peer.securityGroupId(nlb_securitygroup.securityGroupId), ec2.Port.tcp(8080), 'Allow traffic from port 8080')

    const listener = network_loadbalancer.addListener('listener', { port: 80 });

    listener.addTargets('ServerFleet', {
      port: 8080,
      targets: [asg]
    })

    new cdk.CfnOutput(this, 'Asset S3 Output', {
      value: asset.s3ObjectKey,
      description: 'Object key'
    })
    
    new cdk.CfnOutput(this, 'NLB-DNS', {
      value: network_loadbalancer.loadBalancerDnsName,
      description: 'NLB DNS name'
    });
  }
}
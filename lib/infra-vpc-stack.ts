import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { env } from 'process';
import { Tag } from '@aws-cdk/core';

export class InfraVpcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const targetEnv = scope.node.tryGetContext('env');
    const environment = scope.node.tryGetContext(`ENV:${targetEnv}`);

    const natGatewayProvider = ec2.NatProvider.instance({
      instanceType: new ec2.InstanceType('t3.nano')
    });

    const subnetConfiguration = [];
    for (const subnet of environment.dr_vpc_subnets) {
      subnetConfiguration.push({
        subnetType: subnet.type === "PUBLIC" ? ec2.SubnetType.PUBLIC : ec2.SubnetType.PUBLIC,
        name: subnet.subnet_name,
        cidrMask: subnet.cidrMask
      });
    }

    const vpc = new ec2.Vpc(this, environment.dr_vpc_name, {
      cidr: environment.dr_vpc_cidr,
      maxAzs: environment.dr_vpc_maxAzs,
      natGatewayProvider,
      natGateways: 1,
      vpnGateway: false,
      subnetConfiguration
    });

  }
}

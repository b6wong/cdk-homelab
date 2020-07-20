import * as cdk from '@aws-cdk/core';

export class InfraVpcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const targetEnv = scope.node.tryGetContext('env');
    const env = scope.node.tryGetContext(`ENV:${targetEnv}`);

  }
}

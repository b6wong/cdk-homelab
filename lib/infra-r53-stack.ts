import * as cdk from '@aws-cdk/core';
import * as r53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration } from '@aws-cdk/core';

export class InfraR53Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const targetEnv = scope.node.tryGetContext('env');
    const env = scope.node.tryGetContext(`ENV:${targetEnv}`);

    // Defines the HostedZone
    const hostedZone = new r53.HostedZone(this, 'hosted-zone', {
      zoneName: env.hostedZone,
      comment: "Managed by CDK"
    });

    // Production manges the apex domain. It needs to add ZoneDelegationRecords for other accounts
    if (targetEnv === 'prod') {
      for (const subdomain of env.subdomains) {
        const zoneDelegationRecord = new r53.ZoneDelegationRecord(this, 'zone-delegation-record', {
          zone: hostedZone,
          recordName: subdomain.name,
          nameServers: subdomain.ns,
          ttl: Duration.minutes(30)
        });
      }
    }

  }
}

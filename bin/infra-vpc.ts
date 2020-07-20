#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraVpcStack } from '../lib/infra-vpc-stack';

const deployEnv = process.env.DEPLOY_ENV;

if (!deployEnv) {
  console.log('Error: DEPLOY_ENV must be specified');
  process.exit(1);
}

const app = new cdk.App();

const targetEnv = app.node.tryGetContext('env');
const environment = app.node.tryGetContext(`ENV:${targetEnv}`);

const vpcStack = new InfraVpcStack(app, `homelab-vpc-${deployEnv}`, {
  env: {
    region: environment.region,
    account: environment.account
  }
});

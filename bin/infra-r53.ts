#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraR53Stack } from '../lib/infra-r53-stack';

const deployEnv = process.env.DEPLOY_ENV;

if (!deployEnv) {
  console.log('Error: DEPLOY_ENV must be specified');
  process.exit(1);
}

const app = new cdk.App();
new InfraR53Stack(app, `homelab-r53-${deployEnv}`);

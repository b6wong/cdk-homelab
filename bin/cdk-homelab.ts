#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkHomelabStack } from '../lib/cdk-homelab-stack';

const app = new cdk.App();
new CdkHomelabStack(app, 'CdkHomelabStack');

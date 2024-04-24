#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { NetworkStack } from '../lib/network-stack';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Aspects } from 'aws-cdk-lib';

const app = new cdk.App();

const network_stack = new NetworkStack(app, 'POC-Network', { env: { region: 'us-east-2', account: process.env.CDK_DEFAULT_ACCOUNT} })
new PipelineStack(app, 'PipelineStack', { vpcId: network_stack.vpc.vpcId }, { env: { region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT } })
Aspects.of(app).add(new AwsSolutionsChecks())
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { NetworkStack } from '../lib/network-stack';

const app = new cdk.App();

new NetworkStack(app, 'POC-Network', {env:{region: 'us-east-2', account: '151244847490'}})
new PipelineStack(app, 'PipelineStack', { env: { region: 'us-east-1', account:"151244847490" } })
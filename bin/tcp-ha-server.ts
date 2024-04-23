#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { NetworkStack } from '../lib/network-stack';

const app = new cdk.App();

const networkstack = new NetworkStack(app, 'NetworkStack')

new PipelineStack(app, 'PipelineStack', {vpc: networkstack.vpc},{ env: { region: 'us-east-1', account:"151244847490" } })
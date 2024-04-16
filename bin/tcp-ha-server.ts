#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TcpHaServerStack } from '../lib/tcp-ha-server-stack';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

new PipelineStack(app, 'PipelineStack',)
#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AppsyncBackendStack } from '../lib/appsync_backend-stack';
import { CognitoAuthStack } from '../lib/cognito-auth-stack';

const app = new cdk.App();
// deploy cognito user pool and identity pool
new CognitoAuthStack(app, 'CognitoAuthStack');
new AppsyncBackendStack(app, 'AppsyncBackendStack');

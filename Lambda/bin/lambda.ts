#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack';



const app = new cdk.App();



new LambdaStack( app, 'CommonServer', {

  env: {
    account: '151507815327',
    region: 'ap-southeast-1',
  }
});
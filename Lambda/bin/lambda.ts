#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as lambda from "aws-cdk-lib/aws-lambda";



const lambdaAExecutionRoleArns = [
  "arn:aws:iam::151507815327:role/DevGrilledSkewers-LambdaFunctionServiceRoleC555A460-TzTqAW6QkD9E"
];



const app = new cdk.App();



new LambdaStack( app, 'CommonServer', {

  lambdaAExecutionRoleArns: lambdaAExecutionRoleArns
  env: {
    account: '151507815327',          // デプロイ先アカウント
    region: 'ap-southeast-1',         // デプロイ先リージョン
  }
});
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from 'aws-cdk-lib';



interface LambdaBStackProps extends cdk.StackProps {
  lambdaAExecutionRoleArns: string[]; // Lambda_A の実行ロール ARN の配列
}



export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ---- Lambda function "AccessInternet" ----
    const funcAccessInternet = new NodejsFunction(this, 'AccessInternetFunction', {
      functionName: "AccessInternet",
      entry: path.join(__dirname, '../src/Entry.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      bundling: {
        forceDockerBundling: false,
      },
      environment: {
        "TZ": "Asia/Saigon"
      },
      timeout: Duration.seconds( 10 ),
    });

    const sortedArns = [...props.lambdaAExecutionRoleArns].sort();

    sortedArns.forEach((arn, index) => {
      funcAccessInternet.addPermission(`AllowInvokeFromLambdaA_${index}`, {
        principal: new iam.ArnPrincipal(arn),
        action: "lambda:InvokeFunction",
      });
    });
    funcAccessInternet.addPermission( `AllowInvokeFromLambdas`, {

      //principal: new iam.AccountPrincipal( "151507815327" ),
      principal: new iam.ServicePrincipal("lambda.amazonaws.com"),
      action: 'lambda:InvokeFunction',
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from 'aws-cdk-lib';



export class LambdaStack extends cdk.Stack {
  constructor( scope: Construct, id: string, props: cdk.StackProps ) {
    super( scope, id, props );

    // ---- Lambda function "AccessInternet" ----
      functionName: "AccessInternet",
      entry: path.join( __dirname, '../src/Entry.ts' ),
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

    funcAccessInternet.addPermission( `AllowInvokeFromLambdas`, {

      principal: new iam.ServicePrincipal("lambda.amazonaws.com"),
      action: 'lambda:InvokeFunction',
    });
  }
}

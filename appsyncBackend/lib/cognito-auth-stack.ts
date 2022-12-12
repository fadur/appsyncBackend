// stack to deply cognito user pool and identity pool
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import from cognito package
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';



export class CognitoAuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // The code that defines cognito user pool and identity pool is defined here
    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'AppsyncBackendUserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      // password policy
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: false,
        requireUppercase: true,
      },
    });
    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
      userPoolClientName: 'AppsyncBackendUserPoolClient',
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
        adminUserPassword: true,
      },
    });
    userPool.addDomain('UserPoolDomain', {
      cognitoDomain: {
        domainPrefix: 'appsyncbackend',
      }
    });


    // output the user pool id and client id
    // these values will be used in appsyncBackend-stack.ts
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      exportName: 'UserPoolId',
    });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      exportName: 'UserPoolClientId',
    });


    

  }
}

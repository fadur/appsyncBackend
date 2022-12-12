import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import { Construct } from 'constructs';


export class AppRunnerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props); 
    const repoName = cdk.Fn.importValue('RepoName');
 
    const repo = ecr.Repository.fromRepositoryName(this, 'Repo', repoName);

    // instace role for app runner
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
    });

    // const userPoolId = cdk.Fn.importValue('CognitoUserPoolId');
    const clientId = cdk.Fn.importValue('UserPoolClientId');
    // grant access to ecr repo
    repo.grantPullPush(role);
    const appRunnerService = new apprunner.Service(this, 'AppRunnerService', {
      serviceName: 'AppRunnerService',
      instanceRole: role,
      source: apprunner.Source.fromEcr({
        repository: repo,
        tagOrDigest: 'latest',
        imageConfiguration: {
          port: 3000, 
          environment: {
            COGNITO_CLIENT_ID: clientId,
          },
        },
      }),
    });


    new cdk.CfnOutput(this, 'AppRunnerServiceArn', {
      value: appRunnerService.serviceArn,
    });

  }
}

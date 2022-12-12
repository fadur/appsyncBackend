import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export class EcrRepoStack extends cdk.Stack {
  public readonly repo: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.repo = new ecr.Repository(this, 'Repo', {
      repositoryName: 'cognitobackend',
    });

    new cdk.CfnOutput(this, 'RepoName', {
      value: this.repo.repositoryName,
      exportName: 'RepoName',
    });

    new cdk.CfnOutput(this, 'RepoUri', {
      value: this.repo.repositoryUri,
      exportName: 'RepoUri',
    });

    new cdk.CfnOutput(this, 'RepoArn', {
      value: this.repo.repositoryArn,
      exportName: 'RepoArn',
    });

    new cdk.CfnOutput(this, 'RepoUrl', {
      value: this.repo.repositoryUriForTag(),
      exportName: 'RepoUrl',
    });

    new cdk.CfnOutput(this, 'RepoUrlWithTag', {
      value: this.repo.repositoryUriForTag('latest'),
      exportName: 'RepoUrlWithTag',
    });
  }
}

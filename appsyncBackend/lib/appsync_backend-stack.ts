import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as appsync from 'aws-cdk-lib/aws-appsync';
// import iam package
import {aws_iam as iam } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { aws_logs as logs } from 'aws-cdk-lib';
// import dynamodb package
import {aws_dynamodb as dynamodb } from 'aws-cdk-lib';
// import fs and path
import * as fs from 'fs';
import * as path from 'path';


export class AppsyncBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const schema_dir = path.join(__dirname, '../../schema');
    // const resolvers_dir = path.join(__dirname, '../../resolvers');

    // import userpoolid from cognito stack
    const userPoolId = cdk.Fn.importValue('UserPoolId');

    // create cloudwatch log group
    const logGroup = new logs.LogGroup(this, 'AppsyncLogGroup', {
      logGroupName: 'appsync-log-group',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    
    // log group role
    const logGroupRole = new iam.Role(this, 'AppsyncLogGroupRole', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
    });

    // log group policy
    const logGroupPolicy = new iam.Policy(this, 'AppsyncLogGroupPolicy', {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
          resources: [logGroup.logGroupArn],
        }),
      ],
    });

    // attach policy to role
    logGroupPolicy.attachToRole(logGroupRole);


    const GraphQLApi = new appsync.CfnGraphQLApi(this, 'GraphQLApi', {
      name: 'AppsyncBackend',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      userPoolConfig: {
        userPoolId,
        awsRegion: 'eu-central-1',
        defaultAction: 'ALLOW',
      },
      logConfig: {
        fieldLogLevel: 'ALL',
        cloudWatchLogsRoleArn: logGroupRole.roleArn
      },
    });

    // create schema
    const schema = fs.readFileSync(schema_dir + '/schema.graphql', 'utf8');
    const graphqlSchema = new appsync.CfnGraphQLSchema(this, 'GraphQLSchema', {
      apiId: GraphQLApi.attrApiId,
      definition: schema,
    });
    graphqlSchema.addDependsOn(GraphQLApi);

    const TodoTable = new dynamodb.Table(this, 'TodoTable', {
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'TodoTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY,  
    });

    // create role for dynamodb
    const dynamoDbRole = new iam.Role(this, 'DynamoDbRole', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
    });

    // create policy for dynamodb
    const dynamoDbPolicy = new iam.Policy(this, 'DynamoDbPolicy', {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['dynamodb:BatchGetItem', 'dynamodb:BatchWriteItem', 'dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:Scan', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
          resources: [TodoTable.tableArn],
        }),
      ],
    });
    dynamoDbPolicy.attachToRole(dynamoDbRole);

    // create data source
    const dataSource = new appsync.CfnDataSource(this, 'TodoTableDataSource', {
      apiId: GraphQLApi.attrApiId,
      name: 'TodoTableDataSource',
      type: 'AMAZON_DYNAMODB',
      dynamoDbConfig: {
        tableName: TodoTable.tableName,
        awsRegion: 'eu-central-1',
      },
      serviceRoleArn: new iam.Role(this, 'AppsyncDynamoDBRole', {
        assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ],
      }).roleArn,
    });
    dataSource.addDependsOn(GraphQLApi);

    // export graphql apiId, name and url
    new cdk.CfnOutput(this, 'GraphQLApiId', {
      value: GraphQLApi.attrApiId,
      exportName: 'GraphQLApiId',
      description: 'GraphQL API ID',
    });

    new cdk.CfnOutput(this, 'GraphQLApiName', {
      value: GraphQLApi.name,
      exportName: 'GraphQLApiName',
      description: 'GraphQL API Name',
    });

    new cdk.CfnOutput(this, 'GraphQLApiUrl', {
      value: GraphQLApi.attrGraphQlUrl,
      exportName: 'GraphQLApiUrl',
      description: 'GraphQL API URL',
    });

    new cdk.CfnOutput(this, 'GraphQLApiArn', {
      value: GraphQLApi.attrArn,
      exportName: 'GraphQLApiArn',
      description: 'GraphQL API Arn',
    });

    new cdk.CfnOutput(this, 'dataSourceName', {
      value: dataSource.name,
      exportName: 'dataSourceName',
      description: 'Data Source Name',
    });

  }
}

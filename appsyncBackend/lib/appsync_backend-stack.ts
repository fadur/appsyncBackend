import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as appsync from 'aws-cdk-lib/aws-appsync';
// import iam package
import {aws_iam as iam } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { aws_logs as logs } from 'aws-cdk-lib';
// import dynamodb package
// import {aws_dynamodb as dynamodb } from 'aws-cdk-lib';
// import fs and path
import * as fs from 'fs';
import * as path from 'path';


export class AppsyncBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const schema_dir = path.join(__dirname, '../../schema');
    const resolvers_dir = path.join(__dirname, '../../resolvers');

    // import userpoolid from cognito stack
    const userPoolId = cdk.Fn.importValue('appsyncBackendCognitoStackUserPoolId');

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


    new appsync.CfnGraphQLApi(this, 'GraphQLApi', {
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
    new appsync.CfnGraphQLSchema(this, 'GraphQLSchema', {
      apiId: cdk.Fn.ref('GraphQLApi'),
      definition: schema,
    });

    // create resolvers
    // create resolver for Query
    new appsync.CfnResolver(this, 'QueryResolver', {
      apiId: cdk.Fn.ref('GraphQLApi'),
      typeName: 'Query',
      fieldName: 'getTodos',
      dataSourceName: 'TodoTable',
      requestMappingTemplate: fs.readFileSync(resolvers_dir + '/Query.getTodos.req.js', 'utf8'),
      responseMappingTemplate: fs.readFileSync(resolvers_dir + '/Query.getTodos.res.js', 'utf8'),
    });

    // create resolver for Mutation
    new appsync.CfnResolver(this, 'MutationResolver', {
      apiId: cdk.Fn.ref('GraphQLApi'),
      typeName: 'Mutation',
      fieldName: 'createTodo',
      dataSourceName: 'TodoTable',
      // js resolvers in resolvers dir
      requestMappingTemplate: fs.readFileSync(resolvers_dir + '/Mutation.createTodo.req.js', 'utf8'),
      responseMappingTemplate: fs.readFileSync(resolvers_dir + '/Mutation.createTodo.res.js', 'utf8'),
    });


    // create data source
    new appsync.CfnDataSource(this, 'TodoTable', {
      apiId: cdk.Fn.ref('GraphQLApi'),
      name: 'TodoTable',
      type: 'AMAZON_DYNAMODB',
      dynamoDbConfig: {
        tableName: 'TodoTable',
        awsRegion: 'eu-central-1',
      },
      serviceRoleArn: new iam.Role(this, 'AppsyncDynamoDBRole', {
        assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ],
      }).roleArn,
    });
    // create dynamodb table policy
    // attach policy to role
  }
}

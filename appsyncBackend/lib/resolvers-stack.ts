import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
// import * as path from 'path';

export class ResolversStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const resolvers_dir = path.join(__dirname, '../../resolvers');
    // const functions_dir = path.join(__dirname, '../../functions');

    const apiId = cdk.Fn.importValue('GraphQLApiId');
    const dataSourceName = cdk.Fn.importValue('dataSourceName');


    const appsyncFunction = new appsync.CfnFunctionConfiguration(this, 'AppsyncFunction', {
      apiId,
      dataSourceName,
      name: 'AppsyncFunction',
      functionVersion: '2018-05-29',
    });


    new appsync.CfnResolver(this, 'Resolver', {
      apiId: apiId,
      typeName: 'Query',
      fieldName: 'getTodos',
      dataSourceName: dataSourceName,
      pipelineConfig: {
        functions: [appsyncFunction.attrFunctionId],
      },
    });
  }
}



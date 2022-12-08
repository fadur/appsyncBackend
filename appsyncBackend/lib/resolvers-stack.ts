import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as path from 'path';

export class ResolversStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const resolvers_dir = path.join(__dirname, '../../resolvers');
    // const functions_dir = path.join(__dirname, '../../functions');

    const apiId = cdk.Fn.importValue('GraphQLApiId');
    const dataSourceName = cdk.Fn.importValue('dataSourceName');

    new appsync.CfnResolver(this, 'Resolver', {
      apiId: apiId,
      typeName: 'Query',
      fieldName: 'getTodos',
      dataSourceName: dataSourceName,
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(resolvers_dir, 'Query.getTodos.req.vtl')
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(resolvers_dir, 'Query.getTodos.res.vtl')
      ),
    });
  }
}



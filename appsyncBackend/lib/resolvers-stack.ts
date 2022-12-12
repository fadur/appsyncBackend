import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as path from 'path';
import * as fs from 'fs';

export class ResolversStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const resolvers_dir = path.join(__dirname, '../../resolvers');
    // const functions_dir = path.join(__dirname, '../../functions');

    const apiId = cdk.Fn.importValue('GraphQLApiId');
    const dataSourceName = cdk.Fn.importValue('dataSourceName');

    // read the vtl file and output the contents
    const readVtlFile = (fileName: string) => {
      const filePath = path.join(resolvers_dir, fileName);
      // read the file
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return fileContents;
    };

    new appsync.CfnResolver(this, 'Resolver', {
      apiId: apiId,
      typeName: 'Query',
      fieldName: 'getTodos',
      dataSourceName: dataSourceName,
      requestMappingTemplate: readVtlFile('Query.getTodos.req.vtl'),
      responseMappingTemplate: readVtlFile('Query.getTodos.res.vtl'),
    });
  }
}



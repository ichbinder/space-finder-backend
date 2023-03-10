import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as Lambda, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {GenericTable} from "./GenericTable";

export class SpaceStack extends Stack {
    private api = new RestApi(this, 'spaceApi');
    private spaceTable = new GenericTable(
        'spaceTable',
        'spaceId',
        this
    );

    constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambda = new Lambda(this, 'helloLambda', {
        runtime: Runtime.NODEJS_14_X,
        code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
        handler: 'hello.main',
    });

    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);
  }
}
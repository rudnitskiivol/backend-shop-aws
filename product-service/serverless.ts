import type { AWS } from '@serverless/typescript';

import { slsResources } from './serverless-resources';

import {
  getProductsById,
  getProductsList,
  createProduct,
  catalogBatchProcess,
} from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-auto-swagger',
    'serverless-offline',
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    // @ts-ignore
    region: '${env:AWS_REGION_NAME}',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: '${env:PRODUCTS_TABLE}',
      STOCKS_TABLE: '${env:STOCKS_TABLE}',
      AWS_REGION_NAME: '${env:AWS_REGION_NAME}',
      SNS_EMAIL: '${env:SNS_EMAIL}',
      AWS_SNS_TOPIC: {
        Ref: 'createProductTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem'
        ],
        Resource: [
          { 'Fn::GetAtt': ['productsTable', 'Arn' ] },
          { 'Fn::GetAtt': ['stocksTable', 'Arn' ] }
        ]
      },{
        Effect: 'Allow',
        Action: ['sns:Publish'],
        Resource: {
          Ref: 'createProductTopic'
        }
      }
    ]
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  resources: slsResources,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      concurrency: 25,
      exclude: ['aws-sdk'],
      target: 'node14',
      packagePath: './package.json',
      packager: 'npm',
      define: { 'require.resolve': undefined },
    },
    autoswagger: {
      typefiles: ['./src/types/products.d.ts'],
      basePath: '/dev',
      host: '1ad0hf6pyi.execute-api.eu-west-1.amazonaws.com',
      generateSwaggerOnDeploy: false,
    },
  },
};

module.exports = serverlessConfiguration;

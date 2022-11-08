import type { AWS } from '@serverless/typescript';

import {
  importProductsFile,
  importFileParser,
} from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
      AWS_REGION_NAME: '${env:AWS_REGION_NAME}',
      AWS_BUCKET_NAME: '${env:AWS_BUCKET_NAME}',
      UPLOADED_PATH: '${env:UPLOADED_PATH}',
      PARSED_PATH: '${env:PARSED_PATH}',
      AWS_SQS_URL: {
        Ref: 'SQSQueue'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject'
        ],
        Resource: [
          'arn:aws:s3:::${env:AWS_BUCKET_NAME}/*',
        ]
      },{
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        }
      }
    ]
  },
  resources: {
    Resources: {
      S3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${env:AWS_BUCKET_NAME}',
          CorsConfiguration: {
            CorsRules: [{
              AllowedMethods: [
                'PUT',
                'POST',
                'DELETE',
              ],
              AllowedHeaders: [
                '*',
              ],
              AllowedOrigins: [
                '*',
              ],
            }],
          },
        },
      },
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        },
      },
    },
    Outputs: {
      SQSArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
        Export: {
          Name: 'SQSArn'
        }
      }
    },
  },
  // import the function via paths
  functions: {
    importProductsFile,
    importFileParser,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      typefiles: [],
      basePath: '/dev',
      host: '6st2l9vcuj.execute-api.eu-west-1.amazonaws.com',
      generateSwaggerOnDeploy: false,
    },
  },
};

module.exports = serverlessConfiguration;

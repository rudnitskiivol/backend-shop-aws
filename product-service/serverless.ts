import type { AWS } from '@serverless/typescript';

import {
  getProductsById,
  getProductsList,
} from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-auto-swagger',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
  },
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
      host: 'yvlah8nu3j.execute-api.eu-west-1.amazonaws.com',
    },
  },
};

module.exports = serverlessConfiguration;

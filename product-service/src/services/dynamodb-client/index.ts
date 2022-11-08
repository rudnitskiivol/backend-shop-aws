import AWS from 'aws-sdk';

require('dotenv').config();

const isTest = process.env.JEST_WORKER_ID;

const config = {
  region: process.env.AWS_REGION_NAME,
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};
const dynamoDb = new AWS.DynamoDB.DocumentClient(config);

export default dynamoDb;

require('dotenv').config();

export const slsResources = {
    Resources: {
        productsTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: process.env.PRODUCTS_TABLE,
                AttributeDefinitions: [{
                    AttributeName: 'id',
                    AttributeType: 'S'
                }],
                KeySchema: [{
                    AttributeName: 'id',
                    KeyType: 'HASH'
                }],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }
        },
        stocksTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: process.env.STOCKS_TABLE,
                AttributeDefinitions: [{
                    AttributeName: 'product_id',
                    AttributeType: 'S'
                }],
                KeySchema: [{
                    AttributeName: 'product_id',
                    KeyType: 'HASH'
                }],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }
        },
        createProductTopic : {
            Type: "AWS::SNS::Topic",
            Properties: {
                TopicName: "sqs-add-product-topic",
            }
        },
        oneProductSubscription: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                Endpoint: '${env:SNS_EMAIL}',
                TopicArn: {
                    Ref: 'createProductTopic'
                },
                FilterPolicy: {
                    productsAmount: [{ numeric: ['=', 1] }]
                }
            }
        }
    }
}
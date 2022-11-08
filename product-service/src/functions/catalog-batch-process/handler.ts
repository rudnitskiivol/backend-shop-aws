import type { SQSEvent, SQSHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { middyfy } from '../../libs/lambda';
import { addOneProductToDB } from '../create-product/handler';

const SQSHandlerResponse = (data = []) => ({
  batchItemFailures: data,
});

const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  /* eslint-disable no-console */
  console.log('catalogBatchProcess: ', JSON.stringify(event, null, 2));
  let messageId;

  try {
    await Promise.all(event.Records.map(async (record) => {
      messageId = record.messageId;
      const {
        title, count, price, description, image,
      } = JSON.parse(record.body);
      if (title && count && price && description && image) {
        await addOneProductToDB({
          title,
          count,
          price,
          description,
          image,
        });
      } else {
        throw new Error('incorrect product format');
      }
    }));

    const sns = new AWS.SNS({ region: process.env.AWS_REGION_NAME });

    await sns.publish({
      Subject: 'Products import were done',
      Message: `Successfully imported ${event.Records.length} products`,
      TopicArn: process.env.AWS_SNS_TOPIC,
      MessageAttributes: {
        productsAmount: {
          DataType: 'Number',
          StringValue: `${event.Records.length}`,
        },
      },
    }).promise();

    return SQSHandlerResponse();
  } catch (error) {
    console.log(error);

    return SQSHandlerResponse([{
      itemIdentifier: messageId,
    }]);
  }
};

const main = middyfy(catalogBatchProcess);

export default main;

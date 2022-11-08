import {
  S3Event, S3Handler,
} from 'aws-lambda';
import {
  CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client,
} from '@aws-sdk/client-s3';
import { SQS } from 'aws-sdk';

import csv from 'csv-parser';

const sendProductToQueue = async (product) => {
  const sqs = new SQS({ region: process.env.AWS_REGION_NAME });

  const parsedProduct = JSON.stringify(product);

  const message = {
    QueueUrl: process.env.AWS_SQS_URL,
    MessageBody: parsedProduct,
  };

  await sqs.sendMessage(message).promise();
};

const processCSV = async (fileKey: string) => {
  const s3Client = new S3Client({ region: process.env.AWS_REGION_NAME });

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  });

  const file = await s3Client.send(command);

  await new Promise((resolve, reject) => {
    /* eslint-disable no-console */
    file.Body.pipe(csv()).on('data', sendProductToQueue).on('end', resolve).on('error', reject);
  });

  const copyCommand = new CopyObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    CopySource: `${process.env.AWS_BUCKET_NAME}/${fileKey}`,
    Key: fileKey.replace(
      process.env.UPLOADED_PATH,
      process.env.PARSED_PATH,
    ),
  });
  await s3Client.send(copyCommand);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  });
  await s3Client.send(deleteCommand);
};

const importFileParser: S3Handler = async (event: S3Event) => {
  /* eslint-disable no-console */
  console.log('ImportFileParser: ', JSON.stringify(event, null, 2));

  try {
    await event.Records.reduce((p, record) => p.then(
      () => processCSV(record.s3.object.key),
    ), Promise.resolve());
  } catch (error) {
    console.error('ImportFileParser: ', error);
  }
};

export default importFileParser;

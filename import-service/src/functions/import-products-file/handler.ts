import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { middyfy } from '../../libs/lambda';
import { formatJSONBadResponse, formatJSONResponse } from '../../libs/api-gateway';
import { StatusCodes } from '../../helpers/constants';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  /* eslint-disable no-console */
  console.log('createProduct: ', JSON.stringify(event, null, 2));

  const { name } = event.queryStringParameters;

  if (!name) {
    return formatJSONBadResponse(StatusCodes.BAD_REQUEST);
  }

  try {
    const s3Client = new S3Client({ region: process.env.AWS_REGION_NAME });

    const command = new PutObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: `${process.env.UPLOADED_PATH}/${name}` });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    return formatJSONResponse(signedUrl);
  } catch (error) {
    return formatJSONBadResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const main = middyfy(importProductsFile);

export default main;

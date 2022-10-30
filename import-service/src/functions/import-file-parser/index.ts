import { handlerPath } from '../../libs/handler-resolver';

require('dotenv').config();

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      s3: {
        bucket: process.env.AWS_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [{ prefix: `${process.env.UPLOADED_PATH}/` }],
      },
    },
  ],
};

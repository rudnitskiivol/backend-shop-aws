import * as AWSMock from 'aws-sdk-mock';
import { importProductsFile } from './handler';
import { StatusCodes } from '../../helpers/constants';

const createEventObject = (name) => ({ queryStringParameters: { name } });

require('dotenv').config();

describe('importProductsFile test suite', () => {
  it('get signed url [200]', async () => {
    const testCaseEventObject = createEventObject('any-file-name.csv');
    const signedUrlMockResponse = 'https://this-is-signed-url.amazon.com';

    AWSMock.mock('S3', 'getSignedUrl', (_, __, callback) => {
      callback(null, signedUrlMockResponse);
    });

    // @ts-ignore
    const { statusCode } = await importProductsFile(testCaseEventObject, null, null);

    expect(statusCode).toBe(StatusCodes.OK);
  });

  it('bad request without name [400]', async () => {
    const name = null;
    const testCaseEventObject = createEventObject(name);

    // @ts-ignore
    const { statusCode } = await importProductsFile(testCaseEventObject);
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

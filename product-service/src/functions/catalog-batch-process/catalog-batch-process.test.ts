import * as AWSMock from 'aws-sdk-mock';
import { v4 as uuid4 } from 'uuid';
import catalogBatchProcess from './handler';

const rightProduct = {
  title: 'title 1',
  description: 'description 1',
  price: 1,
  count: 1,
  image: 'image 1',
};

const wrongProduct = {
  description: 'description 1',
  price: 1,
  count: 1,
  image: 'image 1',
};

describe('catalogBatchProcess test suite', () => {
  beforeAll(() => {
    AWSMock.mock('SNS', 'publish', (params, callback) => {
      // @ts-ignore
      callback(null, params);
    });
  });

  it('bad products', async () => {
    const wrongProductId = uuid4();
    const testCaseEventObject = {
      Records: [{
        messageId: uuid4(),
        body: JSON.stringify(rightProduct),
      }, {
        messageId: wrongProductId,
        body: JSON.stringify(wrongProduct),
      }],
    };

    const { batchItemFailures } = await catalogBatchProcess(testCaseEventObject, null, null);
    expect(batchItemFailures[0].itemIdentifier).toBe(wrongProductId);
  });

  it('bad event body', async () => {
    const testCaseEventObject = {
      RecordsWrong: [{
        messageId: uuid4(),
        body: JSON.stringify(rightProduct),
      }],
    };

    const { batchItemFailures } = await catalogBatchProcess(testCaseEventObject, null, null);
    expect(batchItemFailures).toHaveLength(1);
  });

  it('void response without errors', async () => {
    const testCaseEventObject = {
      Records: [{
        messageId: uuid4(),
        body: JSON.stringify(rightProduct),
      }],
    };

    const { batchItemFailures } = await catalogBatchProcess(testCaseEventObject, null, null);
    expect(batchItemFailures).toStrictEqual([]);
  });
});

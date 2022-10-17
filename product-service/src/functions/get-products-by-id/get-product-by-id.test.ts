import { ERROR_MESSAGES, StatusCodes } from '../../helpers/constants';
import products from '../../services/fill-dynamodb/products.json';
import getProductsById from './handler';
import fillDb from '../../services/fill-dynamodb';

beforeAll(async () => fillDb(products));

const createEventObject = (id) => ({ pathParameters: { id } });

describe('getProductsById test suite', () => {
  it('return existing product from fake db [200]', async () => {
    const testCaseEventObject = createEventObject(products[0].id);

    // @ts-ignore
    const { body, statusCode } = await getProductsById(testCaseEventObject);
    expect(JSON.parse(body)).toStrictEqual(products[0]);
    expect(statusCode).toBe(StatusCodes.OK);
  });

  it('bad request without id [400]', async () => {
    const id = null;
    const testCaseEventObject = createEventObject(id);
    // @ts-ignore
    const { body, statusCode } = await getProductsById(testCaseEventObject);
    expect(body).toEqual(JSON.stringify({
      message: ERROR_MESSAGES[StatusCodes.BAD_REQUEST],
    }));
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('product not founded with not excited id [404]', async () => {
    const id = 'wrong-id';
    const testCaseEventObject = createEventObject(id);
    // @ts-ignore
    const { body, statusCode } = await getProductsById(testCaseEventObject);
    expect(body).toEqual(JSON.stringify({
      message: ERROR_MESSAGES[StatusCodes.NOT_FOUND],
    }));
    expect(statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

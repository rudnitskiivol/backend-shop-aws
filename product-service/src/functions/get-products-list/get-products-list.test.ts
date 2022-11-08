import getProductsList from './handler';
import products from '../../services/fill-dynamodb/products.json';
import fillDb, { truncateDB } from '../../services/fill-dynamodb';
import { StatusCodes } from '../../helpers/constants';

describe('getProductsList test suite', () => {
  beforeAll(async () => fillDb(products));

  it('return list of products [200]', async () => {
    // @ts-ignore
    const { body, statusCode } = await getProductsList();
    const response = JSON.parse(body);
    expect(response).toContainEqual(products[0]);
    expect(statusCode).toBe(StatusCodes.OK);
  });

  afterAll(async () => truncateDB());
});

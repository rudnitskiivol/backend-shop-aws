import { StatusCodes } from '../../helpers/constants';
import products from '../../fake-db/products.json';
import { getProductsList } from './handler';

describe('getProductsList test suite', () => {
  it('return list of products [200]', async () => {
    // @ts-ignore
    const { body, statusCode } = await getProductsList();
    const productsToCheck = { ...products };
    expect(body).toEqual(JSON.stringify(productsToCheck));
    expect(statusCode).toBe(StatusCodes.OK);
  });
});

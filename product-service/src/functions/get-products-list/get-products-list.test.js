import { getProductsList } from './handler';
import { STATUS_CODES } from '@helpers/constants';
import products from '@fakeDB/products.json';

describe('getProductsList test suite', () => {
    it('return list of products [200]', async () => {
        const { body, statusCode } = await getProductsList();
        const productsToCheck = { ...products };
        expect(body).toEqual(JSON.stringify(productsToCheck));
        expect(statusCode).toBe(STATUS_CODES.OK);
    });
});
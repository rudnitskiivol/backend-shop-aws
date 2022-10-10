import { getAvailableProducts } from './handler';
import { STATUS_CODES } from '@helpers/constants';

jest.mock('@fakeDB/products.json', () => (
    [
        {
            count: 1,
            description: "PRODUCT AVAILABLE",
            id: "1",
            price: 1,
            title: "PRODUCT AVAILABLE",
            image: ""
        },
        {
            count: 0,
            description: "PRODUCT UNAVAILABLE",
            id: "1",
            price: 1,
            title: "PRODUCT UNAVAILABLE",
            image: ""
        }
    ]
))

describe('getAvailableProducts test suite', () => {
    it('return list of available products [200]', async () => {
        const { body, statusCode } = await getAvailableProducts();
        const productsToCheck = { ...[{
                count: 1,
                description: "PRODUCT AVAILABLE",
                id: "1",
                price: 1,
                title: "PRODUCT AVAILABLE",
                image: ""
        }]};
        expect(body).toEqual(JSON.stringify(productsToCheck));
        expect(statusCode).toBe(STATUS_CODES.OK);
    });
});
import { getProductsById } from './handler';
import { STATUS_CODES, ERROR_MESSAGES } from '@helpers/constants';

const createEventObject = (id) => ({ pathParameters: { id } });

describe('getProductsById test suite', () => {

    it('return existing product from fake db [200]', async () => {
        const id = '7567ec4b-b10c-48c5-9345-fc73c48a80a0';
        const testCaseEventObject = createEventObject(id);
        const { body, statusCode } = await getProductsById(testCaseEventObject);
        expect(body).toEqual(JSON.stringify({
            count: 6,
            description: 'Television Masterpiece Series',
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
            price: 520,
            title: 'Batman and Superman',
            image: 'https://www.sideshow.com/storage/product-images/908013/knightmare-batman-and-superman_dc-comics_silo_sm.png'
        }));
        expect(statusCode).toBe(STATUS_CODES.OK);
    });

    it('bad request without id [400]', async () => {
        const id = null;
        const testCaseEventObject = createEventObject(id);
        const { body, statusCode } = await getProductsById(testCaseEventObject);
        expect(body).toEqual(JSON.stringify({
            message: ERROR_MESSAGES[STATUS_CODES.BAD_REQUEST]
        }));
        expect(statusCode).toBe(STATUS_CODES.BAD_REQUEST);
    });

    it('product not founded with not excited id [404]', async () => {
        const id = 'wrong-id';
        const testCaseEventObject = createEventObject(id);
        const { body, statusCode } = await getProductsById(testCaseEventObject);
        expect(body).toEqual(JSON.stringify({
            message: ERROR_MESSAGES[STATUS_CODES.NOT_FOUND]
        }));
        expect(statusCode).toBe(STATUS_CODES.NOT_FOUND);
    });

});
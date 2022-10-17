import createProduct from './handler';
import dynamoDb from '../../services/dynamodb-client';
import { ProductDB, StockDB } from '../../types/db-schemas';
import { Product } from '../../types/products';
import { StatusCodes } from '../../helpers/constants';

const importedProduct = {
  count: 2,
  description: 'IT: Chapter Two',
  price: 230,
  title: 'Pennywise 222',
  image: 'https://www.sideshow.com/storage/product-images/904949/pennywise_it_silo_sm.png',
};

describe('createProduct test suite', () => {
  it('create product [201]', async () => {
    // @ts-ignore
    const { statusCode, body } = await createProduct({
      body: importedProduct,
    });

    const productId = JSON.parse(body).product_id;

    const productDB = await dynamoDb.get({
      TableName: process.env.PRODUCTS_TABLE,
      Key: {
        id: productId,
      },
    }).promise();

    const stockDB = await dynamoDb.get({
      TableName: process.env.STOCKS_TABLE,
      Key: {
        product_id: productId,
      },
    }).promise();

    const product = productDB.Item as ProductDB;
    const stock = stockDB.Item as StockDB;

    const result: Product = {
      ...product,
      count: stock.count,
    };

    expect(result).toStrictEqual({ ...importedProduct, id: productId });
    expect(statusCode).toBe(StatusCodes.CREATED);
  });
});

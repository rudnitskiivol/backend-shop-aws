import dynamoDb from '../dynamodb-client';

import { ProductDB, StockDB } from '../../types/db-schemas';
import { ProductList } from '../../types/products';

require('dotenv').config();

const fillDb = async (products: ProductList) => {
  try {
    const promises = products.map(async (product) => {
      const productDB: ProductDB = {
        id: product.id,
        price: product.price,
        title: product.title,
        description: product.description,
        image: product.image,
      };

      const stockDB: StockDB = {
        product_id: product.id,
        count: product.count,
      };

      await dynamoDb.transactWrite(
        {
          TransactItems: [
            {
              Put: {
                Item: productDB,
                TableName: process.env.PRODUCTS_TABLE,
              },
            }, {
              Put: {
                Item: stockDB,
                TableName: process.env.STOCKS_TABLE,
              },
            },
          ],
        },
      ).promise();
    });

    await Promise.all(promises);

    /* eslint-disable no-console */
    console.log('Fill DynamoDB module: ', 'Product and stock import were successfully done!');
  } catch (e) {
    /* eslint-disable no-console */
    console.log('Fill DynamoDB module: ', e);
  }
};

export default fillDb;

import { v4 as uuid4 } from 'uuid';
import dynamoDb from '../../services/dynamodb-client';
import { formatJSONResponse, formatJSONBadResponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import schema from './schema';

import { StatusCodes } from '../../helpers/constants';
import { ProductPOST } from '../../types/products';

export const addOneProductToDB = async (product: ProductPOST) => {
  const productId = uuid4();

  await dynamoDb.transactWrite(
    {
      TransactItems: [
        {
          Put: {
            Item: {
              id: productId,
              price: product.price,
              title: product.title,
              description: product.description,
              image: product.image,
            },
            TableName: process.env.PRODUCTS_TABLE,
          },
        },
        {
          Put: {
            Item: {
              product_id: productId,
              count: product.count,
            },
            TableName: process.env.STOCKS_TABLE,
          },
        },
      ],
    },
  ).promise();

  return productId;
};

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  /* eslint-disable no-console */
  console.log('createProduct: ', JSON.stringify(event, null, 2));

  const product: ProductPOST = event.body;
  let productId;

  try {
    productId = await addOneProductToDB(product);
  } catch (error) {
    return formatJSONBadResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }

  return formatJSONResponse(JSON.stringify({
    product_id: productId,
  }), StatusCodes.CREATED);
};

const main = middyfy(createProduct);

export default main;

import type { APIGatewayProxyHandler } from 'aws-lambda';
import dynamoDb from '../../services/dynamodb-client';
import type { ProductDB, StockDB } from '../../types/db-schemas';
import type { Product } from '../../types/products';
import { formatJSONResponse, formatJSONBadResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { isNotEmptyObject } from '../../helpers/functions';
import { StatusCodes } from '../../helpers/constants';

const getProductsById: APIGatewayProxyHandler = async (event) => {
  /* eslint-disable no-console */
  console.log('getProductsById: ', JSON.stringify(event, null, 2));

  try {
    if (event?.pathParameters?.id != null) {
      const productId = event.pathParameters.id;
      const productDB = await dynamoDb.get({
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
          id: productId,
        },
      }).promise();

      const stockDB = await dynamoDb.get({
        TableName: process.env.STOCKS_TABLE,
        Key: {
          product_id: event.pathParameters.id,
        },
      }).promise();

      const product = productDB.Item as ProductDB;
      const stock = stockDB.Item as StockDB;

      if (isNotEmptyObject(product) && isNotEmptyObject(stock)) {
        const result: Product = {
          ...product,
          count: stock.count,
        };
        return formatJSONResponse(JSON.stringify(result));
      }

      return formatJSONBadResponse(StatusCodes.NOT_FOUND);
    }

    return formatJSONBadResponse(StatusCodes.BAD_REQUEST);
  } catch (error) {
    return formatJSONBadResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const main = middyfy(getProductsById);

export default main;

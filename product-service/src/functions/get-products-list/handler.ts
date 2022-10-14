import type { APIGatewayProxyHandler } from 'aws-lambda';
import { middyfy } from '../../libs/lambda';

import { getMockedProducts } from '../../fake-db';
import { formatJSONResponse, formatJSONBadResponse } from '../../libs/api-gateway';
import { ProductList } from '../../types/products';

export const getProductsList: APIGatewayProxyHandler = async () => {
  let products: ProductList;

  try {
    products = await getMockedProducts();
  } catch (error) {
    return formatJSONBadResponse(500, error.message || 'Unexpected error.');
  }

  return formatJSONResponse({ ...products });
};

export const main = middyfy(getProductsList);

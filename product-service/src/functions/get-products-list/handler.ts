import type { APIGatewayProxyHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { getMockedProducts } from '@fakeDB/index';
import { formatJSONResponse, formatJSONBadResponse } from '@libs/api-gateway';
import { Product } from '@tstypes/product';

export const getProductsList: APIGatewayProxyHandler = async () => {
  let products: Product[];

  try {
    products = await getMockedProducts();
  } catch (error) {
    return formatJSONBadResponse(500, error.message || 'Unexpected error.');
  }

  return formatJSONResponse({ ...products });
};

export const main = middyfy(getProductsList);
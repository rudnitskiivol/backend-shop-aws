import type { APIGatewayProxyHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { getMockedAvailableProducts } from '@fakeDB/index';
import { formatJSONResponse, formatJSONBadResponse } from '@libs/api-gateway';
import type { Product } from '@tstypes/product';

export const getAvailableProducts: APIGatewayProxyHandler = async () => {
  let products: Product[];

  try {
    products = await getMockedAvailableProducts();
  } catch (error) {
    return formatJSONBadResponse(500, error.message || 'Unexpected error.');
  }

  return formatJSONResponse({ ...products });
};

export const main = middyfy(getAvailableProducts);
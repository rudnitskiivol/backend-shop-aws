import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse, formatJSONBadResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { getMockedProductById } from '@fakeDB/index';
import type { Product } from '@tstypes/product';

const getProductsById: APIGatewayProxyHandler = async (event) => {
  let product: Product;

  try {
    const productId = event.pathParameters.id;
    product = await getMockedProductById(productId);

    if (product) {
      return formatJSONResponse({ ...product });
    }

    return formatJSONBadResponse(404, { message: 'Product not found.' });
  } catch (error) {
    return formatJSONBadResponse(500, error.message || { message: 'Unexpected error.' });
  }
};

export const main = middyfy(getProductsById);
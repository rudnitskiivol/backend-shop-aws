import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse, formatJSONBadResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { isNotEmptyObject } from '../../helpers/functions';
import { StatusCodes } from '../../helpers/constants';

import { getMockedProductById } from '../../fake-db';
import type { Product } from '../../types/products';

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  let product: Product | null;

  try {
    if (event?.pathParameters?.id != null) {
      const productId = event.pathParameters.id;
      product = await getMockedProductById(productId) ?? null;

      if (isNotEmptyObject(product)) {
        return formatJSONResponse({ ...product });
      }

      return formatJSONBadResponse(StatusCodes.NOT_FOUND);
    }

    return formatJSONBadResponse(StatusCodes.BAD_REQUEST);
  } catch (error) {
    return formatJSONBadResponse(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const main = middyfy(getProductsById);

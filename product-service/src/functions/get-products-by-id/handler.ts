import type { APIGatewayProxyHandler } from 'aws-lambda'
import { formatJSONResponse, formatJSONBadResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'

import { isNotEmptyObject } from '@helpers/functions'
import { STATUS_CODES } from '@helpers/constants'

import { getMockedProductById } from '@fakeDB/index'
import type { Product } from '@tstypes/products'

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  let product: Product | null

  try {
    if (event?.pathParameters?.id != null) {
      const productId = event.pathParameters.id
      product = await getMockedProductById(productId) ?? null

      if (isNotEmptyObject(product)) {
        return formatJSONResponse({ ...product })
      }

      return formatJSONBadResponse(STATUS_CODES.NOT_FOUND)
    }

    return formatJSONBadResponse(STATUS_CODES.BAD_REQUEST)
  } catch (error) {
    return formatJSONBadResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const main = middyfy(getProductsById)

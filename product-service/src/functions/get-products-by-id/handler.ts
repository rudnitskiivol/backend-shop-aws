import type { APIGatewayProxyHandler } from 'aws-lambda'
import { formatJSONResponse, formatJSONBadResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'

import { getMockedProductById } from '@fakeDB/index'
import type { Product } from '@tstypes/product'

const getProductsById: APIGatewayProxyHandler = async (event) => {
  let product: Product

  try {
    
    if (event.pathParameters && event.pathParameters.id) {
      const productId = event.pathParameters.id;
      product = await getMockedProductById(productId)

      if (Object.keys(product).length !== 0 && product.constructor === Object) {
        return formatJSONResponse({ ...product })
      }

      return formatJSONBadResponse(404, { message: 'Product not found.' })
    }
    
    return formatJSONBadResponse(400, { message: 'Bad Request.' })
    
  } catch (error) {
    return formatJSONBadResponse(500, error.message || { message: 'Unexpected error.' })
  }
}

export const main = middyfy(getProductsById)

import { handlerPath } from '@libs/handler-resolver'
import { STATUS_CODES } from '@helpers/constants'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        cors: true,
        responses: {
          [STATUS_CODES.OK]: {
            description: 'Successful API response',
            bodyType: 'Product'
          },
          [STATUS_CODES.BAD_REQUEST]: {
            description: 'Product id wasn\'t provided in the path'
          },
          [STATUS_CODES.NOT_FOUND]: {
            description: 'Product with ID wasn\'t found'
          },
          [STATUS_CODES.INTERNAL_SERVER_ERROR]: {
            description: 'Unexpected API error'
          }
        },
        request: {
          parameters: {
            paths: {
              id: true
            }
          }
        }
      }
    }
  ]
}

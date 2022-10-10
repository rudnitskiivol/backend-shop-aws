import { handlerPath } from '@libs/handler-resolver'
import { STATUS_CODES } from '@helpers/constants'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responses: {
          [STATUS_CODES.OK]: {
            description: 'Successful API response',
            bodyType: 'ProductList'
          },
          [STATUS_CODES.INTERNAL_SERVER_ERROR]: {
            description: 'Unexpected API error'
          }
        }
      }
    }
  ]
}

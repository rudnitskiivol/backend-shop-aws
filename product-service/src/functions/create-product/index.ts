import { handlerPath } from '../../libs/handler-resolver';
import schema from './schema';
import { StatusCodes } from '../../helpers/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        bodyType: 'ProductPOST',
        responses: {
          [StatusCodes.CREATED]: {
            description: 'Successful API response',
            bodyType: 'ProductList',
          },
          [StatusCodes.INTERNAL_SERVER_ERROR]: {
            description: 'Unexpected API error',
          },
          [StatusCodes.BAD_REQUEST]: {
            description: 'Incorrect product body values',
          },
        },
      },
    },
  ],
};

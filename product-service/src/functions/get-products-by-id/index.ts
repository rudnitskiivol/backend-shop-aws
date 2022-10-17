import { handlerPath } from '../../libs/handler-resolver';
import { StatusCodes } from '../../helpers/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        cors: true,
        responses: {
          [StatusCodes.OK]: {
            description: 'Successful API response',
            bodyType: 'Product',
          },
          [StatusCodes.BAD_REQUEST]: {
            description: 'Product id wasn\'t provided in the path',
          },
          [StatusCodes.NOT_FOUND]: {
            description: 'Product with ID wasn\'t found',
          },
          [StatusCodes.INTERNAL_SERVER_ERROR]: {
            description: 'Unexpected API error',
          },
        },
        request: {
          parameters: {
            paths: {
              id: true,
            },
          },
        },
      },
    },
  ],
};

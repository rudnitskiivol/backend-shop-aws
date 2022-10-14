import { handlerPath } from '../../libs/handler-resolver';
import { StatusCodes } from '../../helpers/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responses: {
          [StatusCodes.OK]: {
            description: 'Successful API response',
            bodyType: 'ProductList',
          },
          [StatusCodes.INTERNAL_SERVER_ERROR]: {
            description: 'Unexpected API error',
          },
        },
      },
    },
  ],
};

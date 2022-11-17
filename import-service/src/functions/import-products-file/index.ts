import { handlerPath } from '../../libs/handler-resolver';
import { StatusCodes } from '../../helpers/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        responses: {
          [StatusCodes.OK]: {
            description: 'Successful API response',
          },
          [StatusCodes.BAD_REQUEST]: {
            description: 'Name of file does not provided in the query parameter',
          },
          [StatusCodes.INTERNAL_SERVER_ERROR]: {
            description: 'Unexpected API error',
          },
        },
        request: {
          parameters: {
            querystrings: {
              name: {
                required: true,
              },
            },
          },
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: { 'Fn::ImportValue': 'basicAuthorizerArn' },
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      },
    },
  ],
};

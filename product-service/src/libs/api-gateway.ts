import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';
import { CORS_HEADERS, ERROR_MESSAGES, StatusCodes } from '../helpers/constants';
import { isEmptyObject } from '../helpers/functions';

export type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> =
    Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const formatJSONResponse = (response: string, statusCode: number = StatusCodes.OK) => ({
  statusCode,
  ...CORS_HEADERS,
  body: response,
});

export const formatJSONBadResponse = (
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  response: Record<string, unknown> = {},
) => {
  let result = { message: ERROR_MESSAGES[StatusCodes.INTERNAL_SERVER_ERROR] };

  if (isEmptyObject(response)) {
    if (ERROR_MESSAGES[statusCode]) {
      result = { message: ERROR_MESSAGES[statusCode] };
    }
  }

  return {
    statusCode,
    ...CORS_HEADERS,
    body: JSON.stringify(result),
  };
};

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const corsHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    ...corsHeaders,
    body: JSON.stringify(response)
  }
}

export const formatJSONBadResponse = (
  statusCode: number = 500,
  response: Record<string, unknown>
) => {
  return {
    statusCode,
    ...corsHeaders,
    body: JSON.stringify(response)
  };
};

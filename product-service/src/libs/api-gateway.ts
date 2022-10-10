import { CORS_HEADERS, ERROR_MESSAGES, STATUS_CODES } from "@helpers/constants";
import { isEmptyObject } from "@helpers/functions";

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: STATUS_CODES.OK,
    ...CORS_HEADERS,
    body: JSON.stringify(response)
  }
}

export const formatJSONBadResponse = (
  statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
  response: Record<string, unknown> = {}
) => {
  
  if (isEmptyObject(response)) {
    if (ERROR_MESSAGES[statusCode]) {
      response = { message: ERROR_MESSAGES[statusCode] };
    } else {
      response = { message: ERROR_MESSAGES[STATUS_CODES.INTERNAL_SERVER_ERROR]};
    }
  }

  return {
    statusCode,
    ...CORS_HEADERS,
    body: JSON.stringify(response)
  }
}

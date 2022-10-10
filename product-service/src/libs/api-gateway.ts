const corsHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
  }
}

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
  }
}

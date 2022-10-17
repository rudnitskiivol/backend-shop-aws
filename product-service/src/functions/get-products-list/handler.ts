import type { APIGatewayProxyHandler } from 'aws-lambda';
import { middyfy } from '../../libs/lambda';

import dynamoDb from '../../services/dynamodb-client';
import { formatJSONResponse, formatJSONBadResponse } from '../../libs/api-gateway';
import { ProductList } from '../../types/products';
import { ProductListDB, StockListDB } from '../../types/db-schemas';

const getProductsList: APIGatewayProxyHandler = async (event) => {
  /* eslint-disable no-console */
  console.log('getProductsList: ', JSON.stringify(event, null, 2));

  try {
    const productsDB = await dynamoDb.scan({
      TableName: process.env.PRODUCTS_TABLE,
    }).promise();

    const stocksDB = await dynamoDb.scan({
      TableName: process.env.STOCKS_TABLE,
    }).promise();

    const products = productsDB.Items as ProductListDB;
    const stocks = stocksDB.Items as StockListDB;

    const productList: ProductList = stocks.map((stock, index) => ({
      count: stock.count,
      ...products[index],
    }));

    return formatJSONResponse(JSON.stringify(productList));
  } catch (error) {
    return formatJSONBadResponse(500, error.message || 'Unexpected error.');
  }
};

const main = middyfy(getProductsList);

export default main;

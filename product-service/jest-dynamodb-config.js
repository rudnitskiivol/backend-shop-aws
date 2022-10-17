import { slsResources} from "./serverless-resources";

module.exports = {
    tables: [
        slsResources.Resources.productsTable.Properties,
        slsResources.Resources.stocksTable.Properties,
    ],
};
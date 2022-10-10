import type { Product, ProductList } from '@tstypes/products'
import products from './products.json'

// Let's imagine that products are getting from some kind of API and async, await are necessary :)

export const getMockedProducts = async (): Promise<ProductList> => {
  return products
}

export const getMockedProductById = async (id: string): Promise<Product | undefined> => {
  const productsList = await getMockedProducts()
  return productsList.find(product => product.id === id)
}

export const getMockedAvailableProducts = async (): Promise<ProductList> => {
  const productsList = await getMockedProducts()
  return productsList.filter(product => product.count > 0)
}

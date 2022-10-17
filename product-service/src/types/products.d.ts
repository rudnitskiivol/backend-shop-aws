export interface Product {
  count: number
  description: string
  id: string
  price: number
  title: string
  image: string
}

export interface ProductPOST {
  count: number
  description: string
  price: number
  title: string
  image: string
}

export type ProductList = Product[];

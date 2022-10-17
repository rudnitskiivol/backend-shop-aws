export interface ProductDB {
  description: string
  id: string
  price: number
  title: string
  image: string
}

export type ProductListDB = ProductDB[];

export interface StockDB {
  product_id: string,
  count: number
}

export type StockListDB = StockDB[];

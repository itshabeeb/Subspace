
import api from "./api";

export interface ProductVariant {
  id: number;
  brand_name: string;
  extra_price: string;
  product: number;
}

export interface Product {
  id: number;
  name: string;
  product_type: string;
  sales_price: string;
  cost_price: string;
  notes: string;
  variants: ProductVariant[];
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("products/");
  return response.data;
};

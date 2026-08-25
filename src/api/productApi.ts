import type { Product } from "../types";

const API_URL = "http://localhost:3001/products";

export const getProducts = (): Promise<Product[]> => {
  return fetch(API_URL).then((response) => response.json());
};

export const getProductById = (id: string): Promise<Product> => {
  return fetch(`${API_URL}/${id}`).then((response) => response.json());
};

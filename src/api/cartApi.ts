import type { Cart, CartItem } from "../types";

const API_URL = "http://localhost:3001/carts";

// Gets the cart that belongs to a specific user (each user has exactly one cart).
export const getCartByUserId = async (
  userId: string
): Promise<Cart | undefined> => {
  const response = await fetch(`${API_URL}?userId=${userId}`);
  const carts: Cart[] = await response.json();
  return carts[0];
};

export const createCart = (userId: string): Promise<Cart> => {
  const newCart: Omit<Cart, "id"> = { userId, items: [] };
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCart),
  }).then((response) => response.json());
};

export const updateCart = (
  cartId: string,
  items: CartItem[]
): Promise<Cart> => {
  return fetch(`${API_URL}/${cartId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  }).then((response) => response.json());
};

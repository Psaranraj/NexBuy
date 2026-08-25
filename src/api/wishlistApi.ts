import type { Wishlist, Product } from "../types";

const API_URL = "http://localhost:3001/wishlists";

export const getWishlistByUserId = async (
  userId: string
): Promise<Wishlist | undefined> => {
  const response = await fetch(`${API_URL}?userId=${userId}`);
  const wishlists: Wishlist[] = await response.json();
  return wishlists[0];
};

export const createWishlist = (userId: string): Promise<Wishlist> => {
  const newWishlist: Omit<Wishlist, "id"> = { userId, products: [] };
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newWishlist),
  }).then((response) => response.json());
};

export const updateWishlist = (
  wishlistId: string,
  products: Product[]
): Promise<Wishlist> => {
  return fetch(`${API_URL}/${wishlistId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products }),
  }).then((response) => response.json());
};

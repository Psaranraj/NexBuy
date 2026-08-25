import type { Order } from "../types";

const API_URL = "http://localhost:3001/orders";

export const createOrder = async (
  order: Omit<Order, "id">
): Promise<Order> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
};

export const getOrdersByUserId = async (
  userId: string
): Promise<Order[]> => {
  const response = await fetch(
    `${API_URL}?userId=${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  const orders = await response.json();

  return orders.sort(
    (a: Order, b: Order) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
};

export const getOrderById = async (
  id: string
): Promise<Order> => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Order not found");
  }

  return response.json();
};
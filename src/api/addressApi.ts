import type { Address, NewAddress } from "../types";

const API_URL = "http://localhost:3001/addresses";

export const getAddressesByUserId = async (
  userId: string
): Promise<Address[]> => {
  const response = await fetch(`${API_URL}?userId=${userId}`);
  return response.json();
};

export const createAddress = (address: NewAddress): Promise<Address> => {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  }).then((response) => response.json());
};

export const updateAddress = (
  id: string,
  address: NewAddress
): Promise<Address> => {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  }).then((response) => response.json());
};

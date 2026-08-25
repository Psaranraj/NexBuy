import type { User } from "../types";

const API_URL = "http://localhost:3001/users";

export const getUsers = (): Promise<User[]> => {
  return fetch(API_URL).then((response) => response.json());
};

// Finds a user by matching either their email or phone number.
export const getUserByEmailOrPhone = async (
  identifier: string
): Promise<User | undefined> => {
  const users = await getUsers();
  return users.find(
    (user) => user.email === identifier || user.phone === identifier
  );
};

export const registerUser = (newUser: Omit<User, "id">): Promise<User> => {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  }).then((response) => response.json());
};

import { createContext, useState } from "react";
import type { User } from "../types";
import { getUsers } from "../api/userApi";
import { useApi } from "../hooks/useApi";

type AuthContextType = {
  user: User | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "nexbuy_user";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const { execute } = useApi();

  const login = async (
    identifier: string,
    password: string,
  ): Promise<boolean> => {
    const users = await execute(getUsers);

    if (!users) {
      return false;
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim();

    const foundUser = users.find((currentUser) => {
      const userEmail = currentUser.email.trim().toLowerCase();
      const userPhone = currentUser.phone.trim();

      return userEmail === cleanIdentifier || userPhone === cleanPhone;
    });

    if (!foundUser) {
      return false;
    }

    if (foundUser.password !== password) {
      return false;
    }

    setUser(foundUser);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

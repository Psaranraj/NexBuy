import { createContext, useContext, useEffect, useState } from "react";

import type { CartItem, Product } from "../types";
import { AuthContext } from "./AuthContext";
import { useApi } from "../hooks/useApi";
import { getCartByUserId, createCart, updateCart } from "../api/cartApi";

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  removePurchasedItems: (purchasedItems: CartItem[]) => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);

  const { execute: executeLoad } = useApi();
  const { execute: executeUpdate } = useApi();

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        setCartId(null);
        return;
      }

      let existingCart = await executeLoad(() => getCartByUserId(user.id));

      if (!existingCart) {
        existingCart = await executeLoad(() => createCart(user.id));
      }

      if (existingCart) {
        setCart(existingCart.items);
        setCartId(existingCart.id);
      }
    };

    loadCart();
  }, [user]);

  const syncCart = async (items: CartItem[]) => {
    setCart(items);

    if (cartId) {
      await executeUpdate(() => updateCart(cartId, items));
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);

    const updatedItems = existing
      ? cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        )
      : [
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ];

    syncCart(updatedItems);
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = cart.filter((item) => item.id !== productId);

    syncCart(updatedItems);
  };

  const increaseQuantity = (productId: string) => {
    const updatedItems = cart.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item,
    );

    syncCart(updatedItems);
  };

  const decreaseQuantity = (productId: string) => {
    const updatedItems = cart
      .map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      )
      .filter((item) => item.quantity > 0);

    syncCart(updatedItems);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const removePurchasedItems = (purchasedItems: CartItem[]) => {
    const updatedItems = cart
      .map((cartItem) => {
        const purchasedItem = purchasedItems.find(
          (item) => item.id === cartItem.id,
        );

        if (!purchasedItem) {
          return cartItem;
        }

        return {
          ...cartItem,
          quantity: cartItem.quantity - purchasedItem.quantity,
        };
      })
      .filter((item) => item.quantity > 0);

    syncCart(updatedItems);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        removePurchasedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

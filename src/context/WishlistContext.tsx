import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Product } from "../types";
import { AuthContext } from "./AuthContext";
import { useApi } from "../hooks/useApi";
import {
  getWishlistByUserId,
  createWishlist,
  updateWishlist,
} from "../api/wishlistApi";

type WishlistContextType = {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
};

export const WishlistContext = createContext<
  WishlistContextType | undefined
>(undefined);

export function WishlistProvider(props: { children: any }) {
  const { children } = props;

  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  const { execute: executeLoad } = useApi();
  const { execute: executeUpdate } = useApi();

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlist([]);
        setWishlistId(null);
        return;
      }

      let existingWishlist = await executeLoad(() =>
        getWishlistByUserId(user.id)
      );

      if (!existingWishlist) {
        existingWishlist = await executeLoad(() =>
          createWishlist(user.id)
        );
      }

      if (existingWishlist) {
        setWishlist(existingWishlist.products);
        setWishlistId(existingWishlist.id);
      }
    };

    loadWishlist();
  }, [user]);

  const isInWishlist = (productId: string) => {
    return wishlist.some(
      (product) => product.id === productId
    );
  };

  const toggleWishlist = (product: Product) => {
    const alreadyInWishlist = isInWishlist(product.id);

    const updatedProducts = alreadyInWishlist
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updatedProducts);

    if (wishlistId) {
      executeUpdate(() =>
        updateWishlist(wishlistId, updatedProducts)
      );
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
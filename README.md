# NexBuy — Electronics E-commerce App

A beginner-friendly electronics shopping web app (mobiles, laptops, tablets,
accessories) built with React + TypeScript + Vite, React Bootstrap, React
Router DOM, Context API, and JSON Server.

## Tech Stack

- React + TypeScript + Vite
- React Bootstrap + Bootstrap
- React Router DOM
- Context API (Auth, Cart, Wishlist)
- JSON Server (mock backend)

## Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Start the mock backend (JSON Server) — keep this running in one terminal:

   ```
   npm run server
   ```

   This serves `db.json` at `http://localhost:3001` with `products`,
   `users`, `carts`, `addresses`, `orders`, and `wishlists`.

3. In a second terminal, start the frontend:

   ```
   npm run dev
   ```

   Open the printed local URL (usually `http://localhost:5173`).

## Project Structure

```
src/
├── api/         # fetch calls to JSON Server (productApi, userApi, cartApi, addressApi, orderApi, wishlistApi)
├── components/  # Header, Footer, ProductCard, FilterBar, SearchBar, Loading
├── context/     # AuthContext, CartContext, WishlistContext
├── hooks/       # useAuth, useCart, useWishlist, useFetch, useApi
├── pages/       # Home, Products, ProductDetails, Login, Register, Cart,
│                # Wishlist, Addresses, Checkout, Payment, OrderHistory,
│                # OrderDetails, OrderSuccess
├── types.ts     # shared TypeScript types
├── App.tsx
└── main.tsx
```

## Notes

- No user is logged in by default — register a new account, then log in
  manually (registration never auto-logs you in).
- Cart, Wishlist, Addresses, and Orders are all scoped per-user via `userId`.
- Payment is a demo only — no real payment gateway is integrated.
- "Buy Now" uses a temporary in-memory item and does not touch your saved cart.

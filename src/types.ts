export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  image: string;
  description: string;

  // Optional because normal products may not use variants
  variants?: ProductVariant[];

  // Currently selected variant
  selectedVariant?: ProductVariant;
};

export type CartItem = Product & {
  quantity: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type Address = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type NewAddress = Omit<Address, "id">;

export type Order = {
  id: string;
  userId: string;
  cart: CartItem[];
  total: number;
  paymentMethod: string;
  status: string;
  deliveryAddress: Address;
  createdAt: string;
};

export type Wishlist = {
  id: string;
  userId: string;
  products: Product[];
};
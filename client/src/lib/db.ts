// Initial Seed Data
import tShirtImg from '@assets/generated_images/black_oversized_t-shirt_flat_lay.png';
import cargoImg from '@assets/generated_images/off-white_cargo_pants_studio_shot.png';
import hoodieImg from '@assets/generated_images/grey_tactical_hoodie_studio_shot.png';
import jacketImg from '@assets/generated_images/technical_outdoor_jacket_dark_green.png';
import sneakerImg from '@assets/generated_images/minimalist_white_sneakers.png';
import blazerImg from '@assets/generated_images/zara_style_structured_blazer.png';
import denimImg from '@assets/generated_images/denim_jacket_vintage_wash.png';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  brand?: string;
  available: boolean;
  sizes: string[];
  availableSizes: string[];
};

export type CartItem = Product & {
  size: string;
  quantity: number;
};

export type User = {
  id: string;
  email: string;
  password?: string; // In a real app, never store plain text
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  createdAt: number;
};

export type Order = {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: number;
};

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Heavyweight Box Tee",
    price: 85,
    image: tShirtImg,
    category: "Tops",
    brand: "Mines Original",
    description: "Oversized fit. 100% heavy cotton. Garment dyed black. Drop shoulder silhouette. Made in Portugal.",
    available: true,
    sizes: ALL_SIZES,
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: "Structured Cargo Pant",
    price: 180,
    image: cargoImg,
    category: "Bottoms",
    brand: "Mines Original",
    description: "Relaxed fit. Heavy cotton twill. Multiple utility pockets. Adjustable hem. Off-white colorway.",
    available: true,
    sizes: ALL_SIZES,
    availableSizes: ['M', 'L', 'XL'],
  },
  {
    id: 3,
    name: "Tactical Tech Hoodie",
    price: 220,
    image: hoodieImg,
    category: "Outerwear",
    brand: "Mines Original",
    description: "Technical fleece blend. Water resistant overlays. Articulated sleeves. Cropped boxy fit.",
    available: true,
    sizes: ALL_SIZES,
    availableSizes: ALL_SIZES,
  },
  {
    id: 4,
    name: "Alpine Shell Jacket",
    price: 350,
    image: jacketImg,
    category: "Outerwear",
    brand: "Columbia",
    description: "Waterproof breathable membrane. Fully seam sealed. Adjustable storm hood. Designed for extreme conditions.",
    available: true,
    sizes: ALL_SIZES,
    availableSizes: ['S', 'M', 'L'],
  },
  {
    id: 5,
    name: "Core Leather Trainer",
    price: 145,
    image: sneakerImg,
    category: "Footwear",
    brand: "Mines Select",
    description: "Premium full-grain leather upper. Minimalist silhouette. Rubber cupsole. Handcrafted.",
    available: true,
    sizes: SHOE_SIZES,
    availableSizes: ['40', '41', '42', '43', '44'],
  },
  {
    id: 6,
    name: "Architectural Blazer",
    price: 195,
    image: blazerImg,
    category: "Outerwear",
    brand: "Zara",
    description: "Structured shoulders. Tailored fit. Wool blend fabric. Sharp lapels. Modern formal wear.",
    available: true,
    sizes: ALL_SIZES,
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 7,
    name: "Vintage Wash Trucker",
    price: 120,
    image: denimImg,
    category: "Outerwear",
    brand: "Mines Vintage",
    description: "14oz Japanese denim. Vintage wash treatment. Boxy fit. Custom hardware.",
    available: true,
    sizes: ALL_SIZES,
    availableSizes: ['M', 'L', 'XL'],
  },
];

const DB_KEYS = {
  PRODUCTS: 'mines_db_products',
  USERS: 'mines_db_users',
  ORDERS: 'mines_db_orders',
  STORE_SETTINGS: 'mines_db_settings'
};

class LocalDB {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.ORDERS)) {
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
    }
  }

  // Products
  getProducts(): Product[] {
    const data = localStorage.getItem(DB_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  }

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      product.id = Date.now(); // Simple ID generation
      products.push(product);
    }
    
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  }

  deleteProduct(id: number) {
    const products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  }

  // Orders
  getOrders(): Order[] {
    const data = localStorage.getItem(DB_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: Date.now()
    };
    orders.unshift(newOrder); // Add to top
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']) {
    const orders = this.getOrders().map(o => o.id === id ? { ...o, status } : o);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  }

  // Users
  getUsers(): User[] {
    const data = localStorage.getItem(DB_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  getStoreSettings(): { isOpen: boolean } {
    const data = localStorage.getItem(DB_KEYS.STORE_SETTINGS);
    return data ? JSON.parse(data) : { isOpen: true };
  }

  setStoreSettings(settings: { isOpen: boolean }) {
    localStorage.setItem(DB_KEYS.STORE_SETTINGS, JSON.stringify(settings));
  }

  resetProducts() {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
}

export const db = new LocalDB();
export { ALL_SIZES, SHOE_SIZES };

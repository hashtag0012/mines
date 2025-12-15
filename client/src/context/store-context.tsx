import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, Product, CartItem } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";

// Simple product data
const SIMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Class T-Shirt",
    price: 29.99,
    image: "https://image.artistshot.com/p.132-sport_grey_heather-ffffff-3-800x800.jpg",
    category: "Tops",
    description: "Premium class t-shirt with custom design",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: 79.99,
    image: "https://media.gettyimages.com/id/1459710418/photo/high-angle-view-of-jeans-on-white-background-indonesia.jpg?s=612x612&w=0&k=20&c=cVi_mKB5Kz8_R_kXMF5GYBAW4ha9DCM7xXTAV0dq9GA=",
    category: "Bottoms",
    description: "Classic denim jeans",
    available: true,
    sizes: ["28", "30", "32", "34"],
    availableSizes: ["28", "30", "32", "34"]
  },
  {
    id: 3,
    name: "Hoodie",
    price: 59.99,
    image: "https://sfycdn.speedsize.com/fbaf6506-81e1-43a2-bcc1-80e18c7b0146/uk.representclo.com/cdn/shop/files/OBZGJkUZw9ZjdHHptPka8o4waJcbCM-1eZUcgI3_UA.jpg?v=1722438614&width=2000",
    category: "Tops",
    description: "Comfortable cotton hoodie",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    name: "Cargo Shorts",
    price: 49.99,
    image: "https://m.media-amazon.com/images/I/51rsMMG4HuL.jpg",
    category: "Bottoms",
    description: "Utility cargo shorts",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Baseball Cap",
    price: 24.99,
    image: "https://static.vecteezy.com/system/resources/thumbnails/023/440/624/small/baseball-black-cap-on-table-generate-ai-photo.jpg",
    category: "Accessories",
    description: "Classic baseball cap",
    available: true,
    sizes: ["One Size"],
    availableSizes: ["One Size"]
  },
  {
    id: 6,
    name: "Sneakers",
    price: 89.99,
    image: "https://static.vecteezy.com/system/resources/thumbnails/027/179/278/small/red-leather-sneakers-with-white-soles-3-free-photo.jpg",
    category: "Footwear",
    description: "Modern athletic sneakers",
    available: true,
    sizes: ["8", "9", "10", "11"],
    availableSizes: ["8", "9", "10", "11"]
  },
  {
    id: 7,
    name: "Leather Jacket",
    price: 199.99,
    image: "https://www.jackjones.in/cdn/shop/files/902084901_gback_a694f2d6-201f-44aa-899a-2b76137f5d83.jpg?v=1758867737&width=1080",
    category: "Tops",
    description: "Genuine leather jacket",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "Chinos",
    price: 69.99,
    image: "https://media.gq.com/photos/667dc663efa6899a54c4e3fc/3:4/w_748,c_limit/Studio-Nicholson-GQR-Chinos-0319.jpg",
    category: "Bottoms",
    description: "Classic chino pants",
    available: true,
    sizes: ["28", "30", "32", "34"],
    availableSizes: ["28", "30", "32", "34"]
  }
];

interface StoreContextType {
  isStoreOpen: boolean;
  setStoreOpen: (isOpen: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: number, size: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  products: Product[];
  refreshProducts: () => void;
  checkout: (customerInfo: any) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isStoreOpen, setIsStoreOpen] = useState(() => db.getStoreSettings().isOpen);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setProducts(SIMPLE_PRODUCTS);
  }, []);

  const refreshProducts = () => {
    setProducts(SIMPLE_PRODUCTS);
  };

  const setStoreOpen = (isOpen: boolean) => {
    setIsStoreOpen(isOpen);
    db.setStoreSettings({ isOpen });
  };

  const addToCart = (product: Product, size: string) => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to add items to cart.", variant: "destructive" });
      return;
    }
    
    if (!isStoreOpen) {
      toast({ title: "Store Closed", description: "Checkout is currently disabled.", variant: "destructive" });
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
    // Show toast without duration to prevent interference
    const toastNotification = toast({ 
      title: "Added to Cart", 
      description: `${product.name} (${size})`
    });
    
    // Manually dismiss after 2 seconds to prevent cart interference
    setTimeout(() => {
      toastNotification.dismiss();
    }, 2000);
  };

  const removeFromCart = (id: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const clearCart = () => setCart([]);

  const checkout = async (customerInfo: any) => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to place orders.", variant: "destructive" });
      return;
    }
    
    if (!isStoreOpen) {
      toast({ title: "Store Closed", description: "Checkout is currently disabled. Please try again later.", variant: "destructive" });
      return;
    }
    
    if (cart.length === 0) {
      toast({ title: "Cart Empty", description: "Your cart is empty. Add items before checkout.", variant: "destructive" });
      return;
    }
    
    console.log("=== CHECKOUT DEBUG ===");
    console.log("User:", user);
    console.log("Cart:", cart);
    console.log("Customer Info:", customerInfo);
    
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    console.log("Total:", total);
    
    try {
      // Prepare order data for API
      const orderData = {
        order: {
          totalAmount: total,
          status: 'pending',
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address
        },
        items: cart.map(item => ({
          productId: item.id.toString(),
          quantity: item.quantity,
          priceAtPurchase: item.price,
          sizeLabel: item.size
        }))
      };
      
      console.log("Sending order to API:", orderData);
      console.log("User ID:", user.id);
      
      // Send order to server API
      const response = await apiRequest("POST", "/api/orders", orderData);
      console.log("Order response status:", response.status);
      const responseData = await response.json();
      console.log("Order response data:", responseData);
      
      setCart([]);
      setIsCartOpen(false);
      toast({ title: "Order Placed", description: "Thank you for your purchase." });
    } catch (error) {
      console.error("=== ORDER FAILED ===");
      console.error("Error details:", error);
      toast({ 
        title: "Order Failed", 
        description: "There was an error placing your order. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <StoreContext.Provider value={{
      isStoreOpen,
      setStoreOpen,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      products,
      refreshProducts,
      checkout
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

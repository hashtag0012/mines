import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, Product, CartItem } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";

// Simple product data based on PNG filenames
const SIMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Corduroy Quarter Zip",
    price: 79.99,
    image: "/photos/Corduroy quarter zips.png",
    category: "Tops",
    description: "Premium corduroy quarter zip pullover",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "High Neck Sweater",
    price: 89.99,
    image: "/photos/highneck.png",
    category: "Tops",
    description: "Premium high neck sweater",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Winter Upper",
    price: 99.99,
    image: "/photos/winterupper.png",
    category: "Tops",
    description: "Heavyweight winter upper garment",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    name: "Turtleneck",
    price: 69.99,
    image: "/photos/tneck.png",
    category: "Tops",
    description: "Classic turtleneck sweater",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Trousers",
    price: 79.99,
    image: "/photos/trousers.png",
    category: "Bottoms",
    description: "Classic tailored trousers",
    available: true,
    sizes: ["28", "30", "32", "34"],
    availableSizes: ["28", "30", "32", "34"]
  },
  {
    id: 6,
    name: "Sweaters Collection",
    price: 84.99,
    image: "/photos/sweaters.png",
    category: "Tops",
    description: "Premium sweater collection",
    available: true,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"]
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

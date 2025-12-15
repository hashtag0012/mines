import { Link, useLocation } from "wouter";
import { Home, Grid, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();
  const { cart, setIsCartOpen } = useStore();
  const { user } = useAuth();
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const NavItem = ({ href, icon: Icon, label, onClick, className }: { href?: string; icon: any; label: string; onClick?: () => void; className?: string }) => {
    const isActive = href ? location === href : false;
    
    const content = (
      <div className={cn(
        "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
        className
      )}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
        <span className="text-[10px] uppercase tracking-widest font-medium">{label}</span>
      </div>
    );

    if (onClick) {
      return (
        <button onClick={onClick} className={cn("flex-1 h-full relative", className)}>
          {content}
          {label === "Cart" && cartCount > 0 && (
            <span className="absolute top-2 right-8 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      );
    }

    return (
      <Link href={href!} className={cn("flex-1 h-full", className)}>
        {content}
      </Link>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-lg border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-between h-full px-2">
        <NavItem href="/" icon={Home} label="Home" />
        <NavItem href="/shop" icon={Grid} label="Shop" />
        <NavItem icon={ShoppingCart} label="Cart" onClick={() => setIsCartOpen(true)} className="opacity-100 bg-white/10 rounded-md" />
        <NavItem href={user ? "/shop" : "/login"} icon={User} label="Account" />
      </div>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/context/auth-context";
import { ShoppingBag, ShoppingCart, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Navbar() {
  const { isStoreOpen, cart, setIsCartOpen } = useStore();
  const { user, isAdmin, logout } = useAuth();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cart count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    gsap.from(".nav-item", {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={cn(
      "nav-item text-sm tracking-widest uppercase hover:opacity-50 transition-opacity cursor-pointer",
      location === href ? "border-b border-primary" : ""
    )}>
      {children}
    </Link>
  );

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12 md:py-6 flex justify-between items-center",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      {/* Mobile Menu Trigger */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Desktop Left Links */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/shop">Shop</NavLink>
        <NavLink href="/about">About</NavLink>
      </div>

      {/* Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link href="/" className="nav-item text-xl md:text-2xl font-bold tracking-[0.2em] font-sans cursor-pointer">
          MINES
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden md:block">
          <NavLink href="/contact">Contact</NavLink>
        </div>

        {/* Auth Links - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="nav-item h-8 px-4 text-xs uppercase tracking-widest hover:bg-transparent hover:underline">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="nav-item h-8 px-4 text-xs uppercase tracking-widest rounded-none bg-foreground text-background hover:bg-foreground/90">
                  Signup
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <span className="text-xs uppercase tracking-widest text-muted-foreground hidden lg:inline-block">Hi, {user.name}</span>
               {isAdmin && (
                 <Link href="/admin" className="nav-item text-xs uppercase tracking-widest underline">
                   Admin
                 </Link>
               )}
               <button onClick={logout} className="nav-item text-xs uppercase tracking-widest hover:text-muted-foreground">
                 Logout
               </button>
            </div>
          )}
        </div>

        {/* Mobile User Icon (Fallback) */}
        <div className="md:hidden">
           <Link href={user ? "/shop" : "/login"} className="nav-item hover:opacity-50 transition-opacity">
              <User size={20} strokeWidth={1.5} className={user ? "fill-foreground/20" : ""} />
          </Link>
        </div>
        
        <button 
          className="relative transition-all duration-200 p-2 opacity-100 bg-foreground/10 rounded-md hover:bg-foreground/20"
          onClick={() => setIsCartOpen(true)}
          data-testid="button-cart"
          aria-label="Shopping cart"
        >
          <ShoppingBag size={20} strokeWidth={2} className="text-foreground" />
          <span className="sr-only">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-background">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-background z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl uppercase tracking-widest cursor-pointer">
            Home
          </Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl uppercase tracking-widest cursor-pointer">
            Shop
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl uppercase tracking-widest cursor-pointer">
            About
          </Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl uppercase tracking-widest cursor-pointer">
            Contact
          </Link>
          
          <div className="h-px w-12 bg-border my-4" />

          {!user ? (
            <>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl uppercase tracking-widest cursor-pointer">
                Login
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-xl uppercase tracking-widest cursor-pointer font-bold">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="text-xl uppercase tracking-widest text-muted-foreground">Hi, {user.name}</span>
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-xl uppercase tracking-widest underline">
                  Admin
                </Link>
              )}
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-xl uppercase tracking-widest cursor-pointer text-muted-foreground">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

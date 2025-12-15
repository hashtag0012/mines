import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { Cart } from "./Cart";
import { Package, RotateCcw, Ruler, HelpCircle, Instagram, MapPin } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <Navbar />
      <Cart />
      <main className="pt-0 min-h-screen flex flex-col pb-16 md:pb-0">
        {children}
      </main>
      
      <footer className="relative py-20 px-6 md:px-12 border-t border-foreground/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 via-transparent to-foreground/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, currentColor 0.5px, transparent 0.5px), 
                            radial-gradient(circle at 80% 80%, currentColor 0.5px, transparent 0.5px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-light tracking-[0.3em] text-foreground/90">MINES</h2>
              </div>
              <p className="text-base text-muted-foreground max-w-sm leading-relaxed font-light">
                Minimalist streetwear for the modern individual. Designed in isolation.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-foreground/30 to-transparent"></div>
                <p className="text-xs font-medium tracking-widest uppercase text-foreground/60">
                  Est. 2003
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Support</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <a href="/about#shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Shipping</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <a href="/about#returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Returns</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <a href="/about#size-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Size Guide</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <a href="/about#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">FAQ</a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Social</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <a href="https://www.instagram.com/mines.clothing/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-foreground/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                © 2024 MINES Clothing. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-foreground/30 rounded-full"></div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Made with intention.
                </p>
                <div className="w-2 h-2 bg-foreground/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <BottomNav />
    </div>
  );
}

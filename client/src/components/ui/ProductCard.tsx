import { Link } from "wouter";
import { useStore } from "@/context/store-context";
import { Product } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isStoreOpen } = useStore();

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: index * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom-=50",
      }
    });
  }, []);

  return (
    <div ref={cardRef} className="group cursor-pointer">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Brand Badge */}
          {product.brand && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-black/5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-2 py-1 text-foreground/80">
                {product.brand}
              </span>
            </div>
          )}
          
          {!isStoreOpen && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xs uppercase tracking-widest border border-white px-4 py-2">
                Coming Soon
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium uppercase tracking-wide group-hover:text-muted-foreground transition-colors">
              {product.name}
            </h3>
            <span className="text-sm font-mono opacity-60">
              ${product.price}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
             <span>{product.category}</span>
             {product.brand && <span className="opacity-50">{product.brand}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}

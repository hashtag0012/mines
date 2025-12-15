import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/ui/ProductCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function Shop() {
  const { products } = useStore();
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
      <div ref={headerRef} className="mb-16 border-b border-border pb-8">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-4">Collection 01</h1>
        <div className="flex justify-between items-end">
          <p className="text-muted-foreground font-mono text-sm max-w-md">
            Heavyweight cottons, technical nylons, and structured silhouettes.
            Designed for durability and everyday utility.
          </p>
          <span className="font-mono text-sm">{products.length} PRODUCTS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </div>
  );
}

import { useRoute, Link } from "wouter";
import { useStore } from "@/context/store-context";
import { Product } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const { addToCart, isStoreOpen, products } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const product = products.find(p => p.id === Number(params?.id));

  useGSAP(() => {
    gsap.from(".product-anim", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out"
    });
  }, [product]);

  if (!product) return <NotFound />;

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div ref={containerRef} className="pt-24 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        {/* Left: Image Gallery */}
        <div className="bg-secondary relative h-[60vh] md:h-auto overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="p-6 md:p-12 lg:p-20 flex flex-col justify-center bg-background">
          <div className="max-w-md w-full mx-auto">
            <Link href="/shop">
              <a className="product-anim inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-8 hover:text-foreground transition-colors">
                <ArrowLeft size={14} /> Back to Shop
              </a>
            </Link>

            <h1 className="product-anim text-3xl md:text-5xl font-bold uppercase tracking-tight mb-2">
              {product.name}
            </h1>
            <p className="product-anim text-xl font-mono text-muted-foreground mb-8">
              ${product.price}
            </p>

            <div className="product-anim border-t border-b border-border py-6 my-8 space-y-4">
              <p className="leading-relaxed text-sm text-muted-foreground">
                {product.description}
              </p>
              <ul className="text-xs uppercase tracking-widest space-y-1 text-foreground/80">
                <li>• Heavyweight Fabric</li>
                <li>• Oversized Fit</li>
                <li>• Made in Portugal</li>
              </ul>
            </div>

            <div className="product-anim space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-widest">Select Size</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-xs underline text-muted-foreground hover:text-foreground">
                      Size Guide
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg bg-background border-border">
                    <DialogHeader>
                      <DialogTitle className="uppercase tracking-widest">Size Chart (Inches)</DialogTitle>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Size</TableHead>
                          <TableHead>Chest</TableHead>
                          <TableHead>Length</TableHead>
                          <TableHead>Sleeve</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">S</TableCell>
                          <TableCell>22</TableCell>
                          <TableCell>27</TableCell>
                          <TableCell>23</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">M</TableCell>
                          <TableCell>23</TableCell>
                          <TableCell>28</TableCell>
                          <TableCell>24</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">L</TableCell>
                          <TableCell>24</TableCell>
                          <TableCell>29</TableCell>
                          <TableCell>25</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">XL</TableCell>
                          <TableCell>25</TableCell>
                          <TableCell>30</TableCell>
                          <TableCell>26</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-12 border transition-all duration-200 uppercase text-sm tracking-widest",
                      selectedSize === size
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <Button 
                onClick={() => selectedSize && addToCart(product, selectedSize)}
                disabled={!selectedSize || !isStoreOpen}
                className="w-full h-14 rounded-none uppercase tracking-widest text-sm"
              >
                {!isStoreOpen ? "Drop Closed" : selectedSize ? "Add to Cart" : "Select a Size"}
              </Button>

              {!isStoreOpen && (
                <p className="text-xs text-center text-muted-foreground uppercase tracking-wide">
                  Store is currently in preview mode.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

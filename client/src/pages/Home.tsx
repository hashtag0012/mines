import { useRef } from "react";
import { useStore } from "@/context/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProductCard } from "@/components/ui/ProductCard";
import heroImg from "@assets/generated_images/minimalist_streetwear_hero_image_with_brutalist_background.png";
import lookbookImg from "@assets/generated_images/minimalist_lookbook_photo_concrete_wall.png";
import textureImg from "@assets/generated_images/abstract_texture_concrete_grain.png";
import interiorImg from "@assets/generated_images/modern_fashion_store_interior_minimalist.png";
import { ArrowRight, MapPin, Clock, Star } from "lucide-react";
import { Link } from "wouter";

gsap.registerPlugin(ScrollTrigger);

// Add CSS for marquee animation
const marqueeStyles = `
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .animate-marquee {
    animation: marquee 8s linear infinite;
  }
`;

export default function Home() {
  const { products } = useStore();
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(heroImageRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    });

    tl.from(heroTextRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8");

    // Inject marquee styles
    const styleElement = document.createElement('style');
    styleElement.textContent = marqueeStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div ref={heroImageRef} className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Mines Clothing Hero" 
            className="w-full h-full object-cover grayscale contrast-125 brightness-75"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div ref={heroTextRef} className="relative z-10 text-center text-white px-6">
          <h1 className="text-[15vw] md:text-[12vw] font-bold leading-none tracking-tighter mix-blend-difference font-sans">
            MINES
          </h1>
          <p className="text-sm md:text-lg uppercase tracking-[0.3em] mt-4 md:mt-8 font-light">
            Modern Style • Premium Quality
          </p>
          <p className="text-xs md:text-sm uppercase tracking-widest mt-2 font-mono opacity-80">
            Since 2003 | Srinagar
          </p>
          
          <div className="mt-12 flex flex-col items-center gap-6">
            <Link href="/shop">
              <Button 
                size="lg" 
                className="rounded-none bg-white text-black hover:bg-white/90 px-12 h-14 uppercase tracking-widest text-sm"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Identity / Info Section (Updated) */}
      <section className="reveal-section py-24 md:py-32 px-6 md:px-12 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 text-sm uppercase tracking-widest text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <MapPin size={16} /> Lal Chowk, Lambert Lane
            </div>
            <div className="hidden md:block w-1 h-1 bg-muted-foreground rounded-full" />
             <div className="flex items-center gap-2">
              <Clock size={16} /> Est. 2003
            </div>
             <div className="hidden md:block w-1 h-1 bg-muted-foreground rounded-full" />
             <div className="flex items-center gap-2">
              <Star size={16} /> Premium Retail & Wholesale
            </div>
          </div>

          <h2 className="reveal-text text-3xl md:text-5xl font-serif leading-tight mb-8">
            "Fashion that fits every story."
          </h2>
          <p className="reveal-text text-muted-foreground leading-relaxed max-w-2xl mx-auto font-mono text-xs md:text-sm">
            Located in the heart of Srinagar, MINES has been curating premium global fashion since 2003. 
            We bridge the gap between international style and local identity, offering curated collections 
            from brands like Columbia, Zara, and our own premium label.
          </p>
          <div className="reveal-text mt-12">
            <Link href="/about" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-50 transition-opacity group">
              Our History <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <section className="py-8 border-b border-border overflow-hidden bg-black text-white">
        <div className="flex whitespace-nowrap animate-marquee">
           {[...Array(2)].map((_, i) => (
             <div key={i} className="flex gap-16 mx-8 text-2xl font-bold uppercase tracking-tighter opacity-50">
               <span>Columbia</span>
               <span>•</span>
               <span>Zara</span>
               <span>•</span>
               <span>North Face</span>
               <span>•</span>
               <span>Mines Original</span>
               <span>•</span>
               <span>Nike</span>
               <span>•</span>
               <span>Adidas</span>
               <span>•</span>
               <span>Puma</span>
               <span>•</span>
             </div>
           ))}
        </div>
      </section>

      {/* Lookbook / Storefront Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh] border-b border-border">
         <div className="relative h-full overflow-hidden group order-2 md:order-1">
            <img 
              src={interiorImg} 
              alt="Store Interior" 
              className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-12 left-12 text-white">
               <h3 className="text-4xl font-bold uppercase tracking-tighter mb-2">The Store</h3>
               <p className="text-xs uppercase tracking-widest opacity-80">Lambert Lane, Srinagar</p>
            </div>
         </div>
         <div className="bg-secondary/20 flex flex-col justify-center p-12 md:p-24 relative overflow-hidden order-1 md:order-2">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url(${textureImg})`, backgroundSize: 'cover' }} />
            <div className="relative z-10 space-y-8">
               <h3 className="text-2xl font-bold uppercase tracking-widest">Global Brands, Local Soul</h3>
               <p className="text-muted-foreground leading-relaxed font-serif text-lg">
                 From technical outerwear for the mountains to structured tailoring for the city. 
                 We stock authentic pieces from the world's best brands alongside our own premium manufacturing.
               </p>
               <Link href="/shop">
                <Button variant="outline" className="rounded-none border-foreground h-12 px-8 uppercase tracking-widest hover:bg-foreground hover:text-background">
                  Explore Collection
                </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">New Arrivals</h2>
          <Link href="/shop" className="text-sm uppercase tracking-widest hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {products.filter(p => p.available).slice(0, 6).map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* Instagram Integration */}
      <section className="py-24 px-6 md:px-12 bg-black text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4 md:mb-0">@MINES.CLOTHING</h2>
          <p className="text-xs uppercase tracking-widest opacity-60">Lambert Lane, Srinagar</p>
        </div>
        
        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram Post 1 - Image */}
          <div className="relative aspect-[3/4] group cursor-pointer overflow-hidden rounded-lg">
            <a 
              href="https://www.instagram.com/p/DRzf3KKEiNs/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
              target="_blank" 
              rel="noopener"
              className="block w-full h-full"
            >
              <img 
                src="https://instagram.com/p/DRzf3KKEiNs/media?size=l" 
                alt="Instagram Post 1"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666666' font-family='Arial' font-size='14'%3ELoading Instagram Post...%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                  <p className="text-xs font-light tracking-widest opacity-80">View Post</p>
                </div>
              </div>
            </a>
          </div>

          {/* Instagram Post 2 - Image */}
          <div className="relative aspect-[3/4] group cursor-pointer overflow-hidden rounded-lg">
            <a 
              href="https://www.instagram.com/p/DPGH5bdEliJ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
              target="_blank" 
              rel="noopener"
              className="block w-full h-full"
            >
              <img 
                src="https://instagram.com/p/DPGH5bdEliJ/media?size=l" 
                alt="Instagram Post 2"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666666' font-family='Arial' font-size='14'%3ELoading Instagram Post...%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                  <p className="text-xs font-light tracking-widest opacity-80">View Post</p>
                </div>
              </div>
            </a>
          </div>

          {/* Instagram Post 3 - Image */}
          <div className="relative aspect-[3/4] group cursor-pointer overflow-hidden rounded-lg">
            <a 
              href="https://www.instagram.com/p/DQzJoVoEiFU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
              target="_blank" 
              rel="noopener"
              className="block w-full h-full"
            >
              <img 
                src="https://instagram.com/p/DQzJoVoEiFU/media?size=l" 
                alt="Instagram Post 3"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666666' font-family='Arial' font-size='14'%3ELoading Instagram Post...%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                  <p className="text-xs font-light tracking-widest opacity-80">View Post</p>
                </div>
              </div>
            </a>
          </div>

          {/* Instagram Post 4 - Video */}
          <div className="relative aspect-[3/4] group cursor-pointer overflow-hidden rounded-lg">
            <a 
              href="https://www.instagram.com/p/DRG8E10khY6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
              target="_blank" 
              rel="noopener"
              className="block w-full h-full"
            >
              <video
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                poster="https://instagram.com/p/DRG8E10khY6/media?size=l"
              >
                <source src="https://instagram.com/p/DRG8E10khY6/media?size=l" type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center opacity-80">
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                  <p className="text-xs font-light tracking-widest opacity-80">Watch Video</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Follow Button */}
        <div className="mt-12 text-center">
          <a 
            href="https://www.instagram.com/mines.clothing" 
            target="_blank" 
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium tracking-widest uppercase hover:bg-white/90 transition-colors"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  );
}

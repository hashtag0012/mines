import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, ChevronUp, Package, RotateCcw, Ruler, HelpCircle, MapPin, Clock, Phone, Mail } from "lucide-react";
import interiorImg from "@assets/generated_images/modern_fashion_store_interior_minimalist.png";
import heroImg from "@assets/generated_images/minimalist_streetwear_hero_image_with_brutalist_background.png";
import lookbookImg from "@assets/generated_images/minimalist_lookbook_photo_concrete_wall.png";

// Add CSS for flip card animations and marquee
const flipCardStyles = `
  .flip-card-container {
    perspective: 1000px;
  }
  
  .flip-card {
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .flip-card-container:hover .flip-card {
    transform: rotateY(180deg);
  }
  
  .flip-card-front, .flip-card-back {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .animate-marquee {
    animation: marquee 20s linear infinite;
  }
  
  .backface-hidden {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Inject flip card styles
  useGSAP(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = flipCardStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useGSAP(() => {
    gsap.from(containerRef.current?.children || [], {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, []);

  // Handle hash scrolling
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Small delay to ensure the page is rendered
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: 'shipping',
      title: 'Shipping',
      icon: Package,
      content: [
        {
          title: 'Domestic Shipping',
          details: 'Free standard shipping on all orders over $50. Standard delivery takes 5-7 business days.'
        },
        {
          title: 'Express Shipping',
          details: 'Express delivery available for $15. Orders arrive within 2-3 business days.'
        },
        {
          title: 'International Shipping',
          details: 'We ship worldwide. International rates calculated at checkout. Delivery time: 10-15 business days.'
        },
        {
          title: 'Order Processing',
          details: 'All orders are processed within 1-2 business days. You\'ll receive tracking information once shipped.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns',
      icon: RotateCcw,
      content: [
        {
          title: '30-Day Return Policy',
          details: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition.'
        },
        {
          title: 'Return Process',
          details: 'Initiate returns through your account or contact us. We\'ll provide a prepaid shipping label.'
        },
        {
          title: 'Refunds',
          details: 'Refunds processed within 5-7 business days after we receive your return. Original shipping fees non-refundable.'
        },
        {
          title: 'Exchanges',
          details: 'Free exchanges for different sizes. Contact us within 30 days to arrange an exchange.'
        }
      ]
    },
    {
      id: 'size-guide',
      title: 'Size Guide',
      icon: Ruler,
      content: [
        {
          title: 'T-Shirts & Tops',
          details: 'XS: Chest 32-34" | S: 36-38" | M: 40-42" | L: 44-46" | XL: 48-50"'
        },
        {
          title: 'Bottoms & Jeans',
          details: '28: Waist 28" | 30: Waist 30" | 32: Waist 32" | 34: Waist 34" | 36: Waist 36"'
        },
        {
          title: 'How to Measure',
          details: 'Chest: Measure around the fullest part. Waist: Measure around natural waistline. Hips: Measure around fullest part.'
        },
        {
          title: 'Fit Guide',
          details: 'Slim Fit: Tailored close to body. Regular Fit: Classic comfortable fit. Oversized: Relaxed, roomy fit.'
        }
      ]
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: HelpCircle,
      content: [
        {
          title: 'How do I track my order?',
          details: 'Once your order ships, you\'ll receive an email with tracking information. You can also track in your account.'
        },
        {
          title: 'What payment methods do you accept?',
          details: 'We accept all major credit cards, debit cards, and secure online payment methods.'
        },
        {
          title: 'Can I cancel or modify my order?',
          details: 'Orders can be cancelled within 2 hours of placement. After that, please initiate a return once received.'
        },
        {
          title: 'Do you offer gift wrapping?',
          details: 'Yes! Premium gift wrapping available for $5 per item. Select at checkout.'
        }
      ]
    }
  ];

  return (
    <div className="pt-24 pb-24 px-6 md:px-12 min-h-screen bg-background">
      <div ref={containerRef} className="max-w-7xl mx-auto space-y-16">
        
        {/* Creative Hero Section */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground via-transparent to-foreground/20"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px), 
                              radial-gradient(circle at 75% 75%, currentColor 2px, transparent 2px)`,
              backgroundSize: '80px 80px'
            }}></div>
          </div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[600px]">
            {/* Left Content - Creative Typography with Fluff */}
            <div className="space-y-16">
              {/* Year Badge */}
              <div>
                <span className="text-xs font-light tracking-[0.3em] uppercase text-foreground/40">Est. 2003</span>
              </div>
              
              {/* Creative Title */}
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-black tracking-tighter">
                  ABOUT
                </h1>
                <h2 className="text-6xl md:text-7xl font-light tracking-wide text-foreground/80 -mt-8 ml-12">
                  Mines
                </h2>
              </div>
              
              {/* Tagline */}
              <div className="max-w-md">
                <p className="text-lg font-light italic text-foreground/70">
                  Fashion that fits every story.
                </p>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-foreground/30 rounded-full"></div>
                <span className="text-xs font-medium tracking-widest uppercase text-foreground/40">Kashmir's Fashion Destination</span>
              </div>
            </div>
            
            {/* Right Visual - Creative Overlapping Design */}
            <div className="relative h-[500px]">
              {/* Main Background Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden transform rotate-1">
                <img 
                  src={lookbookImg} 
                  alt="Lookbook" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/50 via-transparent to-transparent"></div>
              </div>
              
              {/* Overlapping Rotated Image */}
              <div className="absolute top-12 right-12 w-56 h-56 rounded-2xl overflow-hidden border-4 border-background shadow-2xl transform -rotate-3">
                <img 
                  src={interiorImg} 
                  alt="Store Interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute bottom-12 left-8 px-6 py-3 bg-background/90 backdrop-blur-sm border border-foreground/10 rounded-2xl shadow-xl transform rotate-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-foreground/60 rounded-full"></div>
                  <span className="text-sm font-bold tracking-widest uppercase text-foreground">Since 2003</span>
                </div>
              </div>
              
              {/* Decorative Corner Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-foreground/20 transform rotate-45"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-foreground/20 transform rotate-45"></div>
              
              {/* Floating Dots */}
              <div className="absolute top-20 right-20 w-1 h-1 bg-foreground/40 rounded-full"></div>
              <div className="absolute top-24 right-24 w-2 h-2 bg-foreground/30 rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-1 h-1 bg-foreground/40 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Brand Marquee */}
        <div className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/5"></div>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap">
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Columbia</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Zara</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">North Face</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Mines Original</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Nike</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Adidas</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              
              {/* Duplicate for seamless loop */}
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Columbia</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Zara</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">North Face</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Mines Original</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Nike</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">Adidas</span>
              <span className="text-lg font-light tracking-widest uppercase text-foreground/60 mx-8">•</span>
            </div>
          </div>
        </div>

        {/* Legacy & Collection */}
        <div className="relative py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground via-transparent to-foreground/20"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px), 
                              radial-gradient(circle at 80% 50%, currentColor 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              
              {/* Legacy Section */}
              <div className="relative group">
                {/* Hover glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-foreground/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                
                <div className="relative">
                  {/* Number indicator */}
                  <div className="absolute -top-12 left-0 text-8xl font-bold text-foreground/5 tracking-wider">01</div>
                  
                  {/* Content */}
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-foreground/30 to-transparent"></div>
                      <h3 className="text-4xl font-light tracking-[0.3em] text-foreground/90 uppercase">Legacy</h3>
                    </div>
                    
                    <div className="space-y-6 pl-8">
                      <p className="text-xl leading-relaxed font-light text-muted-foreground">
                        <span className="font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">2003</span> — Born in Srinagar's soul, where heritage whispers through every street corner.
                      </p>
                      <p className="text-xl leading-relaxed font-light text-muted-foreground">
                        <span className="font-semibold text-foreground">Lal Chowk, Lambert Lane</span> — More than a store, a sanctuary where style and tradition dance.
                      </p>
                      <p className="text-xl leading-relaxed font-light text-muted-foreground">
                        From humble beginnings to Kashmir's <span className="font-semibold text-foreground">fashion beacon</span> — mirroring the valley's resilience.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 pl-8">
                      <div className="w-20 h-px bg-gradient-to-r from-foreground/40 to-transparent"></div>
                      <div className="text-xs font-medium tracking-[0.3em] uppercase text-foreground/60 border-l-2 border-foreground/20 pl-4">
                        Twenty Years of Excellence
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collection Section */}
              <div className="relative group">
                {/* Hover glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-l from-foreground/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                
                <div className="relative">
                  {/* Number indicator */}
                  <div className="absolute -top-12 right-0 text-8xl font-bold text-foreground/5 tracking-wider">02</div>
                  
                  {/* Content */}
                  <div className="space-y-8">
                    <div className="relative text-right">
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-l from-foreground/30 to-transparent"></div>
                      <h3 className="text-4xl font-light tracking-[0.3em] text-foreground/90 uppercase">Collection</h3>
                    </div>
                    
                    <div className="space-y-6 pr-8 text-right">
                      <p className="text-xl leading-relaxed font-light text-muted-foreground">
                        Where <span className="font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">global sophistication</span> meets Kashmiri soul — a symphony of style.
                      </p>
                      <p className="text-xl leading-relaxed font-light text-muted-foreground">
                        From <span className="font-semibold text-foreground">Columbia & Zara</span> to exclusive treasures — curated with a connoisseur's eye.
                      </p>
                      <p className="text-xl leading-relaxed font-light text-muted-foreground">
                        Each garment tells a story — of <span className="font-semibold text-foreground">perfect fit</span> and timeless craftsmanship.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end gap-6 pr-8">
                      <div className="text-xs font-medium tracking-[0.3em] uppercase text-foreground/60 border-r-2 border-foreground/20 pr-4">
                        Curated Excellence
                      </div>
                      <div className="w-20 h-px bg-gradient-to-l from-foreground/40 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Center divider element */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
              <div className="w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent"></div>
              <div className="w-2 h-2 bg-foreground rounded-full mx-auto -mt-1"></div>
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div id="customer-care" className="relative py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-tr from-foreground via-transparent to-foreground/20"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, currentColor 1px, transparent 1px), 
                              radial-gradient(circle at 70% 70%, currentColor 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-0.5 bg-gradient-to-r from-foreground/20 to-foreground"></div>
                <h2 className="text-4xl font-light tracking-[0.3em] text-foreground/90 uppercase">Customer Care</h2>
                <div className="w-20 h-0.5 bg-gradient-to-l from-foreground/20 to-foreground"></div>
              </div>
              <p className="text-sm font-medium tracking-widest uppercase text-foreground/60">
                Your Shopping Experience, Perfected
              </p>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sections.map((section) => {
                const Icon = section.icon;
                
                return (
                  <div key={section.id} id={section.id.toLowerCase().replace(/\s+/g, '-')} className="flip-card-container h-80 group">
                    <div className="flip-card relative w-full h-full">
                      {/* Front of card */}
                      <div className="flip-card-front absolute w-full h-full bg-gradient-to-br from-background via-background to-foreground/5 border border-foreground/10 rounded-2xl flex flex-col items-center justify-center p-8 group-hover:border-foreground/20 transition-all duration-500 backface-hidden shadow-lg group-hover:shadow-xl">
                        <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-6 group-hover:bg-foreground/20 transition-colors duration-300">
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-center mb-3">{section.title}</h3>
                        <p className="text-xs text-muted-foreground text-center leading-relaxed">Discover everything you need to know about {section.title.toLowerCase()}</p>
                        
                        {/* Hover indicator */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-foreground/50">
                          <span>Hover to explore</span>
                          <div className="w-4 h-0.5 bg-foreground/30"></div>
                        </div>
                      </div>
                      
                      {/* Back of card */}
                      <div className="flip-card-back absolute w-full h-full bg-gradient-to-br from-foreground/5 to-background border border-foreground/10 rounded-2xl p-6 overflow-y-auto backface-hidden rotate-y-180 shadow-xl">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 pb-3 border-b border-foreground/10">
                            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wider">{section.title}</h3>
                          </div>
                          {section.content.map((item, idx) => (
                            <div key={`${section.id}-item-${idx}`} className="py-3 border-b border-foreground/5 last:border-b-0">
                              <h4 className="font-semibold text-xs uppercase tracking-wide mb-2 text-foreground/90">{item.title}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">{item.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Bottom decorative element */}
            <div className="mt-16 flex items-center justify-center">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-foreground/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Visit Us */}
        <div className="relative py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-tl from-foreground via-transparent to-foreground/20"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 20%, currentColor 1px, transparent 1px), 
                              radial-gradient(circle at 50% 80%, currentColor 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-20 h-0.5 bg-gradient-to-r from-foreground/20 to-foreground"></div>
                <h3 className="text-4xl font-light tracking-[0.3em] text-foreground/90 uppercase">Visit Our Store</h3>
                <div className="w-20 h-0.5 bg-gradient-to-l from-foreground/20 to-foreground"></div>
              </div>
              <p className="text-sm font-medium tracking-widest uppercase text-foreground/60">
                Experience Fashion in the Heart of Kashmir
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Location */}
              <div className="relative group text-center">
                <div className="absolute -inset-3 bg-gradient-to-br from-foreground/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-semibold tracking-wider uppercase mb-3">Location</h4>
                  <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                    <p>Lal Chowk, Lambert Lane</p>
                    <p>Srinagar, Jammu & Kashmir</p>
                    <p>India 190001</p>
                  </div>
                </div>
              </div>
              
              {/* Hours */}
              <div className="relative group text-center">
                <div className="absolute -inset-3 bg-gradient-to-br from-foreground/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors duration-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-semibold tracking-wider uppercase mb-3">Hours</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Monday - Saturday</p>
                    <p className="font-medium text-foreground">10:00 AM - 8:00 PM</p>
                    <p>Sunday</p>
                    <p className="font-medium text-foreground">11:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Contact */}
              <div className="relative group text-center">
                <div className="absolute -inset-3 bg-gradient-to-br from-foreground/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-semibold tracking-wider uppercase mb-3">Email</h4>
                  <div className="text-sm">
                    <a href="mailto:info@minesclothing.com" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                      info@minesclothing.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Quote */}
            <div className="mt-20 relative">
              {/* Decorative elements */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
              
              <div className="relative text-center space-y-6">
                {/* Quote marks */}
                <div className="text-6xl font-serif text-foreground/5 leading-none">"</div>
                
                {/* Main quote */}
                <p className="text-xl md:text-2xl font-light text-foreground/80 leading-relaxed tracking-wide max-w-2xl mx-auto">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Where fashion meets tradition,
                  </span>
                  <br />
                  <span className="bg-gradient-to-l from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    and style finds its home.
                  </span>
                </p>
                
                {/* Decorative dot */}
                <div className="flex items-center justify-center gap-8">
                  <div className="w-1 h-1 bg-foreground/30 rounded-full"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-foreground/50 to-foreground/20 rounded-full"></div>
                  <div className="w-1 h-1 bg-foreground/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
    </div>
  );
}

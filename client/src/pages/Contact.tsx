import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
      <div className="flex flex-col justify-center">
        <div ref={containerRef} className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase">Contact</h1>
          <p className="text-lg font-serif max-w-md">
            For inquiries, collaborations, or assistance, reach out. We are listening.
          </p>
          
          <div className="space-y-2 pt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest">Email</h3>
            <p className="text-muted-foreground font-mono">info@minesclothing.com</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest">Studio</h3>
            <p className="text-muted-foreground font-mono">
              Lal Chowk, Lambert Lane<br />
              Srinagar, Jammu & Kashmir<br />
              India
            </p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/30 p-8 md:p-12 flex flex-col justify-center">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold">Name</label>
            <Input className="bg-background border-transparent focus:border-foreground rounded-none h-12" placeholder="YOUR NAME" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold">Email</label>
            <Input className="bg-background border-transparent focus:border-foreground rounded-none h-12" placeholder="YOUR EMAIL" type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold">Message</label>
            <Textarea className="bg-background border-transparent focus:border-foreground rounded-none min-h-[150px] resize-none p-4" placeholder="HOW CAN WE HELP?" />
          </div>
          <Button className="w-full h-14 rounded-none uppercase tracking-widest">Send Message</Button>
        </form>
      </div>
    </div>
  );
}

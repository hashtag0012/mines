import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useStore } from "@/context/store-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminOrders from "@/components/admin/AdminOrders";

export default function Admin() {
  const { user, isAdmin, logout } = useAuth();
  const { isStoreOpen, setStoreOpen } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users'>('overview');

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/login");
    }
  }, [isAdmin, setLocation]);

  useGSAP(() => {
    gsap.from(".admin-card", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out"
    });
  }, [activeTab]);

  if (!isAdmin) return null;

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-border pb-6 gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-2">Command Center</h1>
            <p className="text-muted-foreground font-mono text-sm">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('overview')}
              className="rounded-none uppercase tracking-widest text-xs"
            >
              Overview
            </Button>
            <Button 
              variant={activeTab === 'orders' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('orders')}
              className="rounded-none uppercase tracking-widest text-xs"
            >
              Orders
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('users')}
              className="rounded-none uppercase tracking-widest text-xs"
            >
              Users
            </Button>
            <Button variant="destructive" onClick={logout} className="rounded-none uppercase tracking-widest text-xs">
              Logout
            </Button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="admin-card bg-background p-8 border border-border shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">Store Status</h3>
                <Store size={20} />
              </div>
              <div className="mb-8">
                <span className={`text-4xl font-bold ${isStoreOpen ? 'text-green-600' : 'text-red-500'}`}>
                  {isStoreOpen ? "OPEN" : "CLOSED"}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  {isStoreOpen 
                    ? "Customers can browse and checkout." 
                    : "Store closed. Customers can only browse."}
                </p>
              </div>
              <Button 
                onClick={() => setStoreOpen(!isStoreOpen)}
                className={`w-full rounded-none uppercase tracking-widest ${isStoreOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isStoreOpen ? "Close Store" : "Open Store"}
              </Button>
            </div>

            <div className="admin-card bg-background p-8 border border-border shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">System Info</h3>
                <Store size={20} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-border pb-2">
                  <span className="text-xs uppercase">Authentication</span>
                  <span className="font-mono text-xs text-green-600">Google OAuth</span>
                </div>
                <div className="flex justify-between items-end border-b border-border pb-2">
                  <span className="text-xs uppercase">Database</span>
                  <span className="font-mono text-xs">PostgreSQL</span>
                </div>
                <div className="flex justify-between items-end border-b border-border pb-2">
                  <span className="text-xs uppercase">Environment</span>
                  <span className="font-mono text-xs">{import.meta.env.MODE}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminOrders />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminUsers />
          </div>
        )}
      </div>
    </div>
  );
}

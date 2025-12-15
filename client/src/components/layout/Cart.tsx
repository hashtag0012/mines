import { useStore } from "@/context/store-context";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export function Cart() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, isStoreOpen, checkout } = useStore();
  const { user } = useAuth();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    checkout(customerInfo);
    setStep('cart'); // Reset for next time
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col p-0 border-l border-border bg-background">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <SheetTitle className="text-lg font-normal tracking-widest uppercase">
            {step === 'cart' ? `Cart (${cart.length})` : 'Checkout'}
          </SheetTitle>
        </div>

        <ScrollArea className="flex-1">
          {step === 'cart' ? (
            cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
                <p className="uppercase tracking-widest text-sm">Your cart is empty</p>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-20 h-24 bg-secondary overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-medium uppercase tracking-wide">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                        <p className="text-sm mt-2">${item.price}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-xs underline hover:no-underline text-muted-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="p-6 space-y-6">
              <div className="bg-secondary/20 p-4 mb-6">
                <div className="flex justify-between text-sm uppercase font-bold mb-2">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Including taxes and shipping</p>
              </div>
              
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold">Full Name</label>
                  <Input 
                    required 
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="rounded-none bg-background" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold">Email</label>
                  <Input 
                    required 
                    type="email"
                    value={customerInfo.email}
                    onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="rounded-none bg-background" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold">Phone</label>
                  <Input 
                    required 
                    type="tel"
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="rounded-none bg-background" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold">Address</label>
                  <Input 
                    required 
                    value={customerInfo.address}
                    onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="rounded-none bg-background" 
                  />
                </div>
              </form>
            </div>
          )}
        </ScrollArea>

        <div className="p-6 border-t border-border space-y-4">
          {step === 'cart' ? (
            <>
              <div className="flex justify-between items-center text-sm uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">Shipping calculated at checkout</p>
              <Button 
                className="w-full rounded-none h-12 uppercase tracking-widest text-xs" 
                disabled={cart.length === 0 || !isStoreOpen}
                onClick={() => setStep('checkout')}
              >
                Proceed to Checkout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1 rounded-none h-12 uppercase tracking-widest text-xs" 
                onClick={() => setStep('cart')}
              >
                Back
              </Button>
              <Button 
                type="submit"
                form="checkout-form"
                className="flex-[2] rounded-none h-12 uppercase tracking-widest text-xs" 
              >
                Place Order
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

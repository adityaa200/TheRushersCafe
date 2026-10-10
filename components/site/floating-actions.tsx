'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ShoppingCart, Plus, Minus, Trash2, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { generateWhatsAppMessage, getWhatsAppLink, formatPrice } from '@/lib/whatsapp';
import { createOrder } from '@/lib/data';
import { startRazorpayPayment } from '@/lib/razorpay';
import { toast } from 'sonner';

interface FloatingActionsProps {
  restaurantName: string;
  whatsappNumber: string;
}

export function FloatingActions({ restaurantName, whatsappNumber }: FloatingActionsProps) {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: '', phone: '' });

  const handleWhatsAppOrder = async () => {
    if (items.length === 0) {
      toast.error('Your order is empty');
      return;
    }
    const message = generateWhatsAppMessage(restaurantName, items, total);
    const link = getWhatsAppLink(whatsappNumber, message);

    await createOrder({
      customer_name: customer.name,
      customer_phone: customer.phone,
      items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      total,
      notes: 'WhatsApp order',
    });

    window.open(link, '_blank');
    toast.success('Opening WhatsApp with your order...');
  };

  const handlePayOnline = async () => {
    if (items.length === 0) return;
    setPaying(true);
    await startRazorpayPayment(
      items,
      total,
      restaurantName,
      customer.name,
      customer.phone,
      (orderId) => {
        setPaying(false);
        setPaid(orderId);
        toast.success('Payment successful! Your order has been placed.');
        clearCart();
      },
      (error) => {
        setPaying(false);
        if (error !== 'Payment cancelled') {
          toast.error(error);
        }
      }
    );
    setPaying(false);
  };

  return (
    <>
      {/* Floating WhatsApp + Cart buttons */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 lg:bottom-6 lg:right-6">
        {itemCount > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => { setShowCart(true); setPaid(null); }}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-lg transition-transform hover:scale-110"
            aria-label="View order"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {itemCount}
            </span>
          </motion.button>
        )}

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleWhatsAppOrder}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card border-l border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="font-serif text-xl font-bold text-foreground">Your Order</h3>
                <button onClick={() => setShowCart(false)} aria-label="Close cart">
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {paid ? (
                /* Payment success state */
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <CheckCircle2 className="h-16 w-16 text-gold" />
                  <h3 className="mt-6 font-serif text-xl font-bold text-foreground">Payment Successful!</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Your order has been confirmed.
                  </p>
                  <p className="mt-2 font-mono text-sm text-gold">Order ID: {paid}</p>
                  <button
                    onClick={() => { setShowCart(false); setPaid(null); }}
                    className="mt-6 border border-border px-6 py-2.5 text-xs font-semibold tracking-widest text-foreground transition-all hover:border-gold hover:text-gold"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              ) : (
                <>
                  {/* Items */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {items.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
                        <p className="mt-4 text-sm text-muted-foreground">Your order is empty</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">Add items from the menu to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 border-b border-border/50 pb-4">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center border border-border text-foreground hover:border-gold"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm text-foreground">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center border border-border text-foreground hover:border-gold"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {/* Customer details */}
                        <div className="space-y-3 pt-2">
                          <p className="text-xs font-semibold tracking-widest text-foreground">YOUR DETAILS (OPTIONAL)</p>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                          />
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={customer.phone}
                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                            className="w-full border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {items.length > 0 && (
                    <div className="border-t border-border p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="font-serif text-2xl font-bold text-gold">{formatPrice(total)}</span>
                      </div>

                      {/* Pay Online */}
                      <button
                        onClick={handlePayOnline}
                        disabled={paying}
                        className="flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-gold/90 disabled:opacity-50"
                      >
                        {paying ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> PROCESSING...</>
                        ) : (
                          <><CreditCard className="h-4 w-4" /> PAY ONLINE</>
                        )}
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={handleWhatsAppOrder}
                        className="mt-2 flex w-full items-center justify-center gap-2 border border-green-600/50 py-3.5 text-xs font-semibold tracking-widest text-green-600 transition-all hover:bg-green-600 hover:text-white"
                      >
                        <MessageCircle className="h-4 w-4" /> ORDER ON WHATSAPP
                      </button>

                      <button
                        onClick={() => { clearCart(); toast.success('Order cleared'); }}
                        className="mt-2 w-full py-2 text-xs text-muted-foreground hover:text-destructive"
                      >
                        Clear order
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

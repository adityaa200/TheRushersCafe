'use client';

import { supabase } from './supabase';
import type { CartItem } from './types';

interface CreateOrderResponse {
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: number;
  currency: string;
  db_order_id: string;
  order_id: string;
}

interface VerifyResponse {
  verified: boolean;
  message?: string;
  error?: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
      prefill?: { name?: string; email?: string; contact?: string };
      theme?: { color?: string };
      modal?: { ondismiss?: () => void };
    }) => { open: () => void };
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
}

export async function startRazorpayPayment(
  items: CartItem[],
  total: number,
  restaurantName: string,
  customerName?: string,
  customerPhone?: string,
  onSuccess?: (orderId: string) => void,
  onFailure?: (error: string) => void
): Promise<void> {
  try {
    await loadRazorpayScript();

    // 1. Create Razorpay order via edge function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total,
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Failed to create order' }));
      const detail = err.details || err.error || 'Failed to create payment order';
      throw new Error(detail);
    }

    const orderData: CreateOrderResponse = await response.json();

    // 2. Open Razorpay checkout
    if (!window.Razorpay) {
      onFailure?.('Payment gateway failed to load. Please try again.');
      return;
    }
    const rzp = new window.Razorpay({
      key: orderData.razorpay_key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: restaurantName,
      description: `Order ${orderData.order_id}`,
      order_id: orderData.razorpay_order_id,
      prefill: {
        name: customerName || '',
        contact: customerPhone || '',
      },
      theme: { color: '#C9A227' },
      handler: async (paymentResponse) => {
        // 3. Verify payment via edge function
        try {
          const verifyResp = await fetch(`${SUPABASE_URL}/functions/v1/verify-razorpay-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              db_order_id: orderData.db_order_id,
            }),
          });

          const verifyData: VerifyResponse = await verifyResp.json();

          if (verifyData.verified) {
            onSuccess?.(orderData.order_id);
          } else {
            onFailure?.(verifyData.error || 'Payment verification failed');
          }
        } catch (err) {
          onFailure?.(err instanceof Error ? err.message : 'Verification failed');
        }
      },
      modal: {
        ondismiss: () => {
          onFailure?.('Payment cancelled');
        },
      },
    });

    rzp.open();
  } catch (err) {
    onFailure?.(err instanceof Error ? err.message : 'Payment failed');
  }
}

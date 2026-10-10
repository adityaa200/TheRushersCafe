import type { CartItem } from './types';

export function generateWhatsAppMessage(
  restaurantName: string,
  items: CartItem[],
  total: number
): string {
  const itemList = items
    .map((item) => `${item.quantity} × ${item.name}`)
    .join('\n');
  const totalStr = `₹${total}`;
  return `Hello ${restaurantName},
I would like to order:

${itemList}

Total: ${totalStr}

Name:
Preferred pickup/delivery time:`;
}

export function getWhatsAppLink(whatsappNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteData } from '../context/SiteDataContext';
import { formatPrice, getProductImage } from '../utils/helpers';
import { Link } from 'react-router-dom';

const CartDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { contactInfo } = useSiteData();

  const buildWAMsg = () => {
    if (!contactInfo?.whatsapp) return '#';
    const list = items.map(i => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.discountPrice||i.product.price)}`).join('\n');
    const msg  = `Hello Mdani Games & Sales Service,\n\nI'd like to order:\n\n${list}\n\nTotal: ${formatPrice(totalPrice)}\n\nPlease confirm availability.`;
    return `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(msg)}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-[#0f2035] border-l border-white/8 flex flex-col shadow-[−4px_0_40px_rgba(0,0,0,0.6)] animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-navy-300" />
            <span className="font-display font-bold text-white">Cart</span>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-navy-900/80 text-navy-300 text-xs font-semibold">{totalItems}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart} className="text-xs text-navy-500 hover:text-red-400 transition-colors">Clear all</button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-white hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart className="w-14 h-14 text-navy-800 mb-4" />
              <p className="font-display font-semibold text-navy-400 mb-1">Cart is empty</p>
              <p className="text-xs text-navy-600 mb-6">Add products to get started</p>
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-sm font-semibold hover:bg-navy-700 transition-colors">
                Browse Products
              </button>
            </div>
          ) : items.map(item => (
            <div key={item.product.id} className="flex gap-3 bg-card border border-white/5 rounded-xl p-3">
              <Link to={`/product/${item.product.slug}`} onClick={onClose} className="shrink-0">
                <img src={getProductImage(item.product.image)} alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-surface"
                  onError={e => { (e.target as HTMLImageElement).src='/placeholder-product.svg'; }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.slug}`} onClick={onClose}>
                  <p className="text-sm font-medium text-white line-clamp-2 hover:text-navy-300 transition-colors">{item.product.name}</p>
                </Link>
                <p className="text-navy-300 font-bold text-sm mt-0.5">{formatPrice(item.product.discountPrice||item.product.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.product.id,item.quantity-1)}
                    className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-navy-300 hover:bg-white/10 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id,item.quantity+1)}
                    className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-navy-300 hover:bg-white/10 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeFromCart(item.product.id)}
                    className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center text-navy-600 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/8 px-4 py-5 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-navy-400 text-sm">Total</span>
              <span className="font-display font-bold text-white text-xl">{formatPrice(totalPrice)}</span>
            </div>
            <a href={buildWAMsg()} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:opacity-90 transition-opacity">
              <MessageCircle className="w-5 h-5" /> Order via WhatsApp
            </a>
            <p className="text-center text-xs text-navy-600">We'll confirm availability via WhatsApp</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;

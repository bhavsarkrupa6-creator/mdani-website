import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, getEffectivePrice, getDiscountPercent, getProductImage } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const effectivePrice  = getEffectivePrice(product.price, product.discountPrice);
  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const inStock         = product.stockStatus === 'IN_STOCK';
  const catName         = product.category && 'name' in product.category ? product.category.name : '';
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <div className="product-card group relative flex flex-col bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl overflow-hidden card-glow transition-all duration-300 hover:shadow-[0_20px_50px_rgba(10,65,116,0.3)]">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-[#0b1e30] aspect-[4/3]">
        <img
          src={getProductImage(product.image)}
          alt={product.name}
          loading="lazy"
          className="product-img w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg'; }}
        />

        {/* Discount badge */}
        {discountPercent && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-red-500/90 text-white text-[11px] font-bold tracking-wide shadow-lg">
            -{discountPercent}%
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-[#0b1929]/70 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-[#0b1929]/90 border border-white/15 text-white text-xs font-bold tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick cart btn on hover */}
        {inStock && (
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className={`absolute bottom-2.5 right-2.5 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 active:scale-90 ${
              inCart
                ? 'bg-navy-300 text-navy-950'
                : 'bg-[#0f2035]/80 backdrop-blur-md border border-white/15 text-navy-300 hover:bg-navy-900 hover:border-navy-300/30'
            }`}
            title={inCart ? 'In cart' : 'Add to cart'}
          >
            {inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {catName && (
          <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1.5">
            {catName}
          </span>
        )}

        <Link to={`/product/${product.slug}`} className="flex-1">
          <h3 className="font-display font-semibold text-navy-50 text-sm sm:text-[15px] leading-snug line-clamp-2 mb-3 hover:text-navy-300 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <span className="font-display font-bold text-white text-lg sm:text-xl">
              {formatPrice(effectivePrice)}
            </span>
            {discountPercent && (
              <span className="block text-xs text-navy-500 line-through mt-0.5">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
            inStock
              ? 'bg-green-500/8 border-green-500/15 text-green-400'
              : 'bg-red-500/8 border-red-500/15 text-red-400'
          }`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

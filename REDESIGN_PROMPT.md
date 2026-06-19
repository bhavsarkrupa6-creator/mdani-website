# Mdani Games & Sales Service — Frontend Redesign Prompt

You are working on a React + TypeScript + Vite + Tailwind CSS gaming ecommerce website called **Mdani Games & Sales Service**.

---

## What needs to be done

Redesign the entire frontend with the following requirements:

### 1. Color Theme — Rich Dark Navy (NOT pitch black)
Use these exact colors throughout:
- Background: `#0b1929`
- Surface (cards/panels): `#0f2035`
- Card bg: `#132840`
- Card hover: `#172f4a`
- Primary accent: `#7BBDE8`
- Secondary accent: `#4E8EA2`
- Text: `#ddeef8`
- Muted text: `#7BBDE8`
- Borders: `rgba(123,189,232,0.08)` default, `rgba(123,189,232,0.18)` on hover

The website should feel like a **rich premium navy gaming store**, NOT a dark/black theme. Think deep ocean navy blue — warm, trustworthy and aesthetic.

### 2. Remove ALL filter sidebars from product pages
- The `/products` page should have NO filter sidebar
- The `/category/:slug` pages should have NO filter sidebar
- Replace the filter sidebar with only a simple **sort dropdown** (Newest, Price Low-High, Price High-Low, Name A-Z)
- Keep subcategory chips on category pages
- Keep the search bar on the products page

### 3. Cart System
Add a full cart system with:
- Cart icon in the navbar with item count badge
- Slide-in cart drawer from the right side
- Add to Cart button on every product card (appears on hover)
- Add to Cart + In Cart state on product detail page
- Cart drawer shows: product image, name, price, quantity +/-, remove button
- "Order via WhatsApp" button in cart that sends the full cart list as a WhatsApp message
- Cart persists in localStorage

### 4. Product Cards — Bigger, Gameloot-style
Make product cards look like major gaming ecommerce stores:
- Aspect ratio 4:3 for the image area
- Large clear product image taking majority of card space
- Category label above product name in small caps
- Product name in 2 lines max
- Price prominently displayed
- Stock badge (In Stock = green, Out of Stock = red) as small pill
- Quick Add to Cart button appears on hover in bottom-right of image
- Smooth image zoom on hover
- Subtle blue glow on card hover

### 5. Scroll to Top Fix
Add a `ScrollToTop` component that uses `useLocation` from react-router-dom and calls `window.scrollTo({ top: 0, behavior: 'instant' })` on every route change. Include this in the Layout component.

### 6. Homepage Sections (in order)
1. Hero section — dark navy gradient with grid pattern overlay, headline, subtext, Shop Now + WhatsApp CTA buttons
2. Shop by Category — 2x4 grid of category cards with emoji icons
3. Featured Products — 4-column product grid
4. New Arrivals — 4-column product grid
5. Why Choose Us — 4 benefit cards
6. Testimonials — 3-column review cards with star ratings
7. WhatsApp CTA banner

### 7. Navbar
- Sticky with blur on scroll
- Top info bar (desktop only) showing store tagline + phone number
- Logo with Gamepad2 icon
- Desktop nav with dropdown mega menus for PlayStation and Xbox categories
- Search bar that expands inline
- Cart icon with badge
- Mobile hamburger with slide-in drawer
- WhatsApp button at bottom of mobile drawer

### 8. General UI Rules
- All inputs/selects: dark navy background, subtle border, white text, focus glow
- All buttons: rounded-xl minimum
- Section headings: small eyebrow text in caps + large bold title
- Cards: `rounded-2xl`, subtle border, navy bg, blue glow on hover
- No pure black (`#000`) anywhere — use navy shades
- Font: Sora for headings, Inter for body (from Google Fonts)
- Framer Motion for hero fade-in and category card stagger animations

---

## File structure reference
```
frontend/src/
├── admin/           ← DO NOT touch admin files
├── components/
│   ├── CartDrawer.tsx     ← New
│   ├── Footer.tsx         ← Redesign
│   ├── Layout.tsx         ← Add ScrollToTop
│   ├── LoadingSpinner.tsx ← Dark theme
│   ├── Navbar.tsx         ← Redesign with cart
│   ├── ProductCard.tsx    ← Redesign bigger cards
│   ├── ProductCardSkeleton.tsx ← Dark theme
│   ├── ScrollToTop.tsx    ← New
│   └── WhatsAppFloat.tsx  ← Appears after scroll 300px
├── context/
│   └── CartContext.tsx    ← New — cart state + localStorage
├── pages/
│   ├── About.tsx          ← Dark theme
│   ├── Category.tsx       ← Remove filters, keep subcategory chips + sort
│   ├── Contact.tsx        ← Dark theme
│   ├── Home.tsx           ← Full redesign
│   ├── NotFound.tsx       ← Dark theme
│   ├── ProductDetail.tsx  ← Dark theme + Add to Cart button
│   ├── Products.tsx       ← Remove filter sidebar, keep sort + search
│   └── RepairRequest.tsx  ← Dark theme
└── index.css              ← Full dark navy CSS variables
```

---

## Key components to add

### CartContext (`src/context/CartContext.tsx`)
- `CartItem = { product: Product, quantity: number }`
- `addToCart(product)`, `removeFromCart(id)`, `updateQuantity(id, qty)`, `clearCart()`
- `totalItems`, `totalPrice`
- `isInCart(id): boolean`
- Persist to `localStorage` with key `mdani_cart`

### ScrollToTop (`src/components/ScrollToTop.tsx`)
```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};
export default ScrollToTop;
```

---

## DO NOT change
- Any files in `src/admin/`
- Backend files
- `src/types/index.ts`
- `src/utils/api.ts`
- `src/utils/helpers.ts`
- `src/context/AuthContext.tsx`
- `src/context/SiteDataContext.tsx`
- `tailwind.config.js` color names (keep `navy-300`, `navy-950` etc.)
- `App.tsx` routing (only add `CartProvider` wrapper)

---

## Tailwind color palette to use
```js
navy: {
  950: '#001D39',
  900: '#0A4174',
  700: '#49769F',
  500: '#4E8EA2',
  400: '#6EA2B3',
  300: '#7BBDE8',
  100: '#BDD8E9',
  50:  '#ddeef8',
}
bg:      '#0b1929'
surface: '#0f2035'
card:    '#132840'
```

# Mdani Games & Sales Service

A production-ready gaming ecommerce platform with a React/TypeScript frontend, Node.js/Express backend, PostgreSQL database (via Prisma), and a full Admin Panel.

---

## 🗂️ Project Structure

```
mdani/
├── backend/           # Node.js + Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       └── routes/
└── frontend/          # React + TypeScript + Vite + Tailwind CSS
    └── src/
        ├── admin/     # Full admin panel
        ├── components/
        ├── context/
        ├── pages/
        ├── types/
        └── utils/
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Cloudinary account (free tier works)

---

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL, JWT_SECRET, Cloudinary credentials
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

The API will run on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

The site will run on `http://localhost:5173`.

---

## 🔑 Default Admin Credentials

```
URL:      http://localhost:5173/admin
Username: mdaniadmin
Password: mdaniadmin8210
```

**Change the password immediately after first login** via Admin → Settings.

---

## 🚀 Deployment

### Backend → Railway

1. Create a new Railway project at https://railway.app
2. Add a **PostgreSQL** service — Railway provides a `DATABASE_URL` automatically
3. Add your backend repo (or deploy from this folder)
4. Set these **environment variables** in Railway:

```
DATABASE_URL=           (auto-provided by Railway Postgres)
JWT_SECRET=             (generate a strong random string)
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=  (from Cloudinary dashboard)
CLOUDINARY_API_KEY=     (from Cloudinary dashboard)
CLOUDINARY_API_SECRET=  (from Cloudinary dashboard)
FRONTEND_URL=           (your Vercel URL, e.g. https://mdani-games.vercel.app)
ADMIN_SEED_USERNAME=mdaniadmin
ADMIN_SEED_PASSWORD=mdaniadmin8210
PORT=5000
```

5. In Railway, add a **start command**: `npm start`
6. Add a **build command**: `npm install && npx prisma generate && npx prisma migrate deploy && node prisma/seed.js`

> Railway auto-detects Node.js and runs your build command on deploy.

---

### Frontend → Vercel

1. Go to https://vercel.com → New Project → Import your repo
2. Set **Root Directory** to `frontend`
3. Set **Framework Preset** to `Vite`
4. Add this **environment variable**:

```
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
```

5. Deploy — Vercel handles the rest. The `vercel.json` ensures SPA routing works.

---

## 🛠️ Post-Deployment Checklist

- [ ] Change admin password (Admin → Settings)
- [ ] Update Contact Info (Admin → Contact Info) — phone, WhatsApp, email, address
- [ ] Edit Site Content (Admin → Site Content) — hero title, about us
- [ ] Add your product categories (Admin → Categories)
- [ ] Add products with images (Admin → Products → Add Product)
- [ ] Mark products as Featured to show on homepage
- [ ] Upload a Hero Banner (Admin → Banners → location: HERO)
- [ ] Add testimonials (Admin → Testimonials)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Images | Cloudinary |
| Frontend deploy | Vercel |
| Backend deploy | Railway |

---

## 🔒 Security Features

- JWT authentication with expiry
- bcrypt password hashing (12 rounds)
- Rate limiting on all API routes (300/15min) and stricter on login (10/15min)
- XSS protection via xss-clean
- Helmet.js security headers
- CORS restricted to your frontend URL
- Input validation on all forms
- Prepared statements via Prisma (SQL injection protection)

---

## 📱 Admin Panel Pages

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard with stats |
| `/admin/products` | List, toggle stock, toggle visibility |
| `/admin/products/new` | Add product |
| `/admin/products/:id/edit` | Edit product |
| `/admin/categories` | Manage categories & subcategories |
| `/admin/banners` | Manage hero/promo/homepage banners |
| `/admin/testimonials` | Manage customer testimonials |
| `/admin/repair-requests` | View & update repair request statuses |
| `/admin/messages` | Read & reply to contact inquiries |
| `/admin/content` | Edit homepage text, about us, footer |
| `/admin/contact-info` | Edit phone, WhatsApp, email, address |
| `/admin/settings` | Change admin password |

---

## 🌐 Public Site Pages

| Path | Purpose |
|------|---------|
| `/` | Homepage |
| `/products` | All products with search + filters |
| `/category/:slug` | Category page with subcategory filter |
| `/product/:slug` | Product detail with gallery + inquiry |
| `/repair` | Repair request form |
| `/about` | About us |
| `/contact` | Contact form + details |

---

## 📞 WhatsApp Integration

Every product page has an **"Order on WhatsApp"** button that pre-fills this message:

```
Hello Mdani Games & Sales Service,

I am interested in:

Product Name: {product_name}

Please provide availability and pricing.
```

The WhatsApp number is managed from **Admin → Contact Info** — no code changes required.

---

## 🖼️ Image System

- All images are uploaded to **Cloudinary** via the admin panel
- Images are auto-optimized (WebP, quality:auto)
- Missing images fall back to a custom SVG placeholder (controller icon + "Image Coming Soon")
- Gallery images supported per product with click-to-navigate carousel

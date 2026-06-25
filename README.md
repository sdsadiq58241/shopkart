# ShopKart 🛒

A modern, full-stack e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and NextAuth.

![ShopKart Banner](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop&q=80)

## ✨ Features

- 🔐 **Authentication** - Register/Login with JWT sessions, bcrypt password hashing
- 🛍️ **Product Catalog** - 30+ products across 8 categories with filters, search, sorting
- 🛒 **Cart & Wishlist** - Real-time cart management with Zustand state
- 📦 **Orders** - Full order flow with address, payment selection, tracking
- 👤 **User Dashboard** - Order history, wishlist, addresses, profile
- 🛡️ **Admin Dashboard** - Manage products, users, orders with analytics
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Mobile Responsive** - Mobile-first design

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (Credentials) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| UI | shadcn/ui + Radix UI |
| Notifications | Sonner |

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd shopkart
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shopkart"
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🔑 Test Credentials

After seeding:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopkart.com | Admin@123456 |
| User | rahul@example.com | User@123456 |

## 📁 Project Structure

```
shopkart/
├── prisma/
│   ├── schema.prisma       # Database models
│   └── seed.ts            # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # NextAuth + Register
│   │   │   ├── products/  # Product CRUD
│   │   │   ├── cart/      # Cart management
│   │   │   ├── wishlist/  # Wishlist
│   │   │   ├── orders/    # Order management
│   │   │   ├── reviews/   # Product reviews
│   │   │   └── admin/     # Admin APIs
│   │   ├── auth/          # Login & Register pages
│   │   ├── products/      # Product listing & detail
│   │   ├── cart/          # Cart page
│   │   ├── checkout/      # Checkout page
│   │   ├── dashboard/     # User dashboard
│   │   ├── admin/         # Admin dashboard
│   │   ├── wishlist/      # Wishlist page
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── layout/        # Navbar, Footer
│   │   ├── ProductCard.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── StarRating.tsx
│   │   └── providers.tsx
│   ├── lib/
│   │   ├── auth.ts        # NextAuth config
│   │   ├── prisma.ts      # Prisma client
│   │   ├── utils.ts       # Helper functions
│   │   └── validations.ts # Zod schemas
│   └── store/
│       ├── cartStore.ts   # Zustand cart
│       └── wishlistStore.ts # Zustand wishlist
├── .env.example
├── .env.local             # Your actual env vars
├── vercel.json
├── netlify.toml
└── package.json
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repo in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production domain
4. Deploy!

**Recommended PostgreSQL providers:** Neon, Supabase, Railway, PlanetScale

### Netlify

1. Push to GitHub
2. Import in [Netlify](https://app.netlify.com)
3. Build command: `npm run build`
4. Add environment variables in Site Settings
5. Deploy!

## 📊 Database Models

| Model | Description |
|-------|-------------|
| User | Authentication, profile, role (USER/ADMIN) |
| Product | Catalog with images, ratings, categories |
| Order | Purchase records with status tracking |
| OrderItem | Line items for each order |
| Cart | Persistent shopping cart |
| Wishlist | Saved items |
| Review | Product ratings and comments |
| Address | Saved delivery addresses |

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| GET | /api/products | List products (with filters) |
| GET | /api/products/[id] | Product details + reviews |
| GET/POST/PUT/DELETE | /api/cart | Cart management |
| GET/POST/DELETE | /api/wishlist | Wishlist management |
| GET/POST | /api/orders | User orders |
| POST | /api/reviews | Submit review |
| GET/POST | /api/admin/products | Admin product management |
| GET | /api/admin/users | Admin user list |
| GET | /api/admin/orders | Admin order list |

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #2874F0 | Main brand color, buttons |
| Secondary | #172337 | Dark navy, navbar |
| Accent | #FF9F00 | CTA buttons, highlights |
| Success | #388E3C | Success states, ratings |
| Background | #F1F3F6 | Page background |

## 📜 License

MIT License - feel free to use this project for commercial purposes.

---

Built with ❤️ using Next.js & Prisma
```

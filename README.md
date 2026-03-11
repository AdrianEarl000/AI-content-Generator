# 🚀 AI Content Generator

A modern, full-stack SaaS application for generating AI-powered content. Built with Next.js 14, TypeScript, Prisma, PostgreSQL, and Google Gemini.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-teal?style=flat-square&logo=prisma)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)

---

## ✨ Features

- **Authentication** — Email/password + Google OAuth via NextAuth.js
- **AI Generation** — Powered by Google Gemini (gemini-2.5-flash / 3.1-pro). Generates blog posts, social captions, marketing copy, and product descriptions
- **Dashboard** — Usage stats, token tracking, content type breakdown
- **History** — Paginated history with type filtering, copy & delete actions
- **Pricing** — Free (10/mo) and Pro (unlimited) plans
- **Dark mode** — Full dark/light mode support
- **Responsive** — Mobile-first responsive layout

---

## 🗂 Project Structure

```text
src/
├── app/
│   ├── (auth)/            # Login & signup pages
│   │   ├── login/
│   │   └── signup/
│   ├── api/
│   │   ├── auth/          # NextAuth + register endpoints
│   │   ├── generate/      # AI generation endpoint
│   │   ├── history/       # GET + DELETE history
│   │   └── user/stats/    # Dashboard stats
│   ├── dashboard/
│   │   ├── page.tsx       # Overview
│   │   ├── generate/      # Content generator
│   │   ├── history/       # Content history
│   │   └── pricing/       # Pricing plans
│   ├── layout.tsx
│   ├── page.tsx           # Landing page
│   └── globals.css
├── components/
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   └── ui/
│       ├── session-provider.tsx
│       ├── theme-provider.tsx
│       └── toaster.tsx
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── gemini.ts          # Gemini AI client + prompts
│   ├── prisma.ts          # Prisma singleton
│   └── utils.ts
├── middleware.ts          # Route protection
└── types/
    └── index.ts
prisma/
└── schema.prisma         # Database schema
```

---

## 🚦 Getting Started

### 1. Clone & Install

```bash
git clone [https://github.com/AdrianEarl000/AI-content-Generator.git](https://github.com/AdrianEarl000/AI-content-Generator.git)
cd ai-content-generator
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GEMINI_API_KEY="your-google-ai-studio-key""
```

### 3. Set Up Database

```bash
# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (billing) | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret | ❌ |

---

## 🗄️ Database Schema

The Prisma schema includes:
- **User** — Auth + profile data
- **Account/Session** — NextAuth OAuth accounts
- **Generation** — AI-generated content with type, prompt, result, tokens
- **Subscription** — User plan (FREE/PRO/ENTERPRISE)
- **UsageTracking** — Monthly/total generation & token counts

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Set `DATABASE_URL` to a production PostgreSQL instance (Supabase, Neon, PlanetScale)
5. Deploy!

### Recommended Database Providers
- **[Neon](https://neon.tech)** — Serverless PostgreSQL (free tier)
- **[Supabase](https://supabase.com)** — Full-featured PostgreSQL
- **[PlanetScale](https://planetscale.com)** — Serverless MySQL (change provider in schema)

---

## 🔧 Adding Stripe Billing

1. Create a Stripe account and product/price
2. Add Stripe env variables
3. Create `/api/stripe/checkout` route for checkout sessions
4. Create `/api/stripe/webhook` route for subscription updates
5. Update subscription status in `UsageTracking` on successful payment

---

## 📋 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/generate` | Generate AI content |
| GET | `/api/history` | Get generation history |
| DELETE | `/api/history?id=` | Delete a generation |
| GET | `/api/user/stats` | Get dashboard stats |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **AI**: Google Gemini API
- **Deployment**: Vercel-ready

---

## 📄 License

MIT — free to use and modify.

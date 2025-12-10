# ExpenseFlow — AI-Powered Expense Tracker

A modern expense-tracking application built with **Next.js**, **TypeScript**, **Prisma**, **PostgreSQL/Supabase**, and **Gemini AI**.  
It allows users to log expenses manually or through AI-powered natural-language input.

## Preview

> Replace this with your own screenshot or deployed link later.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=ExpenseFlow+Preview)

---

## 🚀 Features

- 💸 Add, edit, delete expenses
- 🤖 **AI-powered expense creation** using **Gemini API**
- 🧠 Natural-language expense parsing
- 🗂 Category management
- 📊 Dashboard with summaries & charts
- 🔐 Authentication (Supabase or NextAuth)
- 🗄 **Prisma ORM** + PostgreSQL
- 🎨 UI built with **Tailwind CSS**
- ⚡ Fast & optimized with Next.js App Router

---

## 🛠 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL / Supabase**
- **Gemini API (Google AI Studio)**
- **TanStack Query (React Query)**
- **Tailwind CSS**
- **React Hook Form + Zod**

---

## 📂 Project Structure

app/
├─ dashboard/
├─ api/
│ ├─ expenses/
│ ├─ categories/
│ └─ ai/ # Gemini-powered API route
├─ components/
└─ core/
├─ hooks/
├─ schema/
├─ lib/

---

## ⚙️ Prerequisites

Make sure you have:

- Node.js 18+
- PostgreSQL or Supabase database
- Gemini API key
- Prisma (local or via npx)

---

## 🔧 Environment Variables

Create a `.env` file:

DATABASE_URL="your_postgres_or_supabase_url"
NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_key"

---

## 🧩 Prisma Setup

Generate client:

```bash
npx prisma generate


npx prisma db push

npx prisma studio


Start development server:
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

Visit the app:

👉 http://localhost:3000

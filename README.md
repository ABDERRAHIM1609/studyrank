# 📚 StudyRank (To-Do & Student Daily Ranking)

A full-stack Next.js web application designed for students: plan your daily tasks, move them to Done, and see how you rank among your peers in your school, your city, and across Morocco.

---

## 🌟 Features

1. **Two-Column Task Board (To Do → Done)**
   - Enter your daily study goals and tasks.
   - Click **Done →** or check off items to move them seamlessly from the **To Do** list to the **Done** column.
   - Real-time visual progress bar tracking your % completed.

2. **Daily End-of-Day Ranking System**
   - Automatically computes your completion rate at the end of each day.
   - Computes 3 levels of ranking:
     - 🏫 **School Rank** (e.g. #45 in your school)
     - 🏙️ **City Rank** (e.g. #778 in your city)
     - 🇲🇦 **National Rank** (e.g. #7,899 in Morocco)
   - Daily snapshots saved so you can look back at past performance.

3. **Leaderboard**
   - Filter rankings by **Morocco (National)**, **City**, or **School**.
   - Highlights top 3 achievers (🥇, 🥈, 🥉).

4. **Authentication**
   - Secure student registration with Name, Email, Password, School, City, and Country.
   - Powered by NextAuth.js and bcrypt password hashing.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions & Route Handlers)
- **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [NextAuth.js v5](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Quick Start Guide

### 1. Configure Environment Variables

Create a file named `.env.local` inside `C:\Users\User\3D Objects\todo\`:

```env
# Get this from your free account at https://neon.tech
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz.region.aws.neon.tech/neondb?sslmode=require

# NextAuth secret key (generate any random string or run: openssl rand -base64 32)
AUTH_SECRET=studyrank-super-secret-key-at-least-32-characters-long

# Base URL (for local development)
NEXTAUTH_URL=http://localhost:3000
```

### 2. Push Database Schema to Neon

Run Drizzle push to automatically create all tables in your Neon PostgreSQL database:

```bash
npm run db:push
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 📦 Deployment to Vercel

1. Push your project to GitHub or import the folder in the [Vercel Dashboard](https://vercel.com/).
2. In the Vercel project settings, add the Environment Variables:
   - `DATABASE_URL`: Your Neon connection string
   - `AUTH_SECRET`: A generated secret string
   - `NEXTAUTH_URL`: `https://your-app.vercel.app`
3. Click **Deploy**! 🚀

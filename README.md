# 🌉 The Bridge Platform

> **Connecting students to careers through verified credentials and AI-powered guidance.**

---

## 👋 Welcome to The Bridge

**What is this?**
Imagine a professional network (like LinkedIn) designed specifically for students, but smarter. The Bridge Platform isn't just about who you know; it's about **proving what you know**. It connects students, educational institutions, and employers in a trusted ecosystem.

**Who is it for?**
*   **Students**: To build a verified portfolio, find career paths, and get hired.
*   **Employers**: To find talent with verified skills (no more guessing if a resume is true).
*   **Institutions**: To issue digital credentials that actually mean something in the job market.

---

## 🚀 Key Features (What can you do?)

### 1. 🎓 Smart Dashboard
Think of this as your career command center. Instead of a feed of random posts, you get:
*   **Personalized Job Matches**: Jobs that actually fit your skills.
*   **Trending Skills**: See what skills are hot in the market right now (e.g., "Quantum Computing is up 42%").

### 2. 🎒 Credential Wallet
A digital backpack for your achievements.
*   **Blockchain Verification**: When you earn a certificate, it's "stamped" digitally. This means it's impossible to fake. Employers can scan a QR code to instantly verify you really earned that degree or certificate.

### 3. 🧭 Career Navigator
A GPS for your professional life.
*   **Pathfinding**: Want to be a "Senior AI Engineer"? The system looks at where you are now and draws a map of exactly what skills, courses, and roles you need to get there.
*   **Skill Gap Analysis**: It tells you, "You're great at Python, but you need to learn TensorFlow to get this job."

### 4. 📂 Project Portfolio
Show, don't just tell.
*   Upload your actual work (videos, code, designs).
*   Tag collaborators (who you worked with).
*   Get endorsements from mentors.

---

## 🛠️ For Developers: Technical Deep Dive

This section explains how the system is built.

### 🏗️ Architecture Overview

The application is **in active development** with partial backend integration.
*   **Frontend**: Modern Next.js 16 App Router with TypeScript
*   **Backend**: REST API with Next.js API routes (partially implemented)
*   **Database**: PostgreSQL with Prisma ORM (27+ tables)
*   **Authentication**: NextAuth.js v5 (beta) with credentials provider
*   **Data**: Mix of real database persistence and mock data

### 💻 Technology Stack

We use modern, industry-standard tools:

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router) - The engine running the website.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - Adds strict rules to JavaScript to prevent bugs.
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - For rapid, beautiful design.
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Reusable, accessible interface elements.
*   **Icons**: [Lucide React](https://lucide.dev/) - Clean, consistent icons.

### 📂 Project Structure

Here is how the code is organized:

```
bridge-platform/
├── app/                    # The main application code (Next.js App Router)
│   ├── (dashboard)/        # Pages you see after logging in (Dashboard, Profile, etc.)
│   ├── api/                # Backend API routes (REST API)
│   ├── auth/               # Authentication pages (sign in, sign up)
│   └── globals.css         # Global styles and design tokens
├── components/             # Reusable building blocks
│   ├── ui/                 # Buttons, Inputs, Cards (Basic elements)
│   ├── dashboard/          # Complex blocks like "JobCard" or "SkillChart"
│   ├── dialogs/            # Modal dialogs for forms
│   └── providers/          # React context providers
├── lib/                    # Helper functions and utilities
│   ├── db.ts               # Prisma database client
│   ├── auth.ts             # NextAuth configuration
│   ├── api-client.ts       # API request utilities
│   ├── middleware.ts       # Authentication middleware
│   └── hooks/              # Custom React hooks
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # Prisma schema definition
├── types/                  # TypeScript definitions (The "Shape" of our data)
└── public/                 # Images and static files
```

### 💾 Data Model (The "Brain")

The system uses a comprehensive database schema with **27+ tables** covering:
*   **Users & Profiles** - Authentication, learner profiles, user settings
*   **Skills & Trending** - Skills management with trending data
*   **Credentials** - Credential management with verification requests
*   **Projects** - Portfolio projects with media, skills, and collaborators
*   **Opportunities** - Jobs/internships with AI-powered matching
*   **Applications** - Job application tracking
*   **Network** - Connections, connection requests, messaging
*   **Notifications** - User notifications and feed items
*   **Career Paths** - Career path generation with skill gaps
*   **Courses** - Course management with skill associations

*For the full database schema, read [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md).*

---

## ⚡ Getting Started

Follow these steps to run the project on your computer.

### Prerequisites
*   **Node.js** (Version 18 or higher) installed.
*   **PostgreSQL** database (local or cloud).
*   **Git** installed.

### Quick Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/TommyBangs/thebridgesl.git
    cd thebridgesl
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    ```bash
    cp .env.example .env
    # Edit .env with your database URL and NextAuth secret
    ```

4.  **Set up the database**:
    ```bash
    npm run db:generate
    npm run db:push
    ```

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

6.  **Open your browser**:
    Go to [http://localhost:3000](http://localhost:3000) and sign up for an account!

### Detailed Setup

For detailed setup instructions, including database configuration and troubleshooting, see **[SETUP.md](./SETUP.md)**.

**Note**: Currently experiencing database connectivity issues with Prisma. Ensure your `DATABASE_URL` is correctly configured before running the application.

---

## 🎯 Features

### ✅ Fully Implemented (Real API Integration)
- **Home Dashboard** - Trending skills, opportunities, user profile
- **User Profiles** - Edit profile, download profile, public profiles
- **Projects Portfolio** - Full CRUD with media support
- **Career Navigator** - Path generation, skill gap analysis
- **Job Opportunities** - Listing with AI matching scores
- **User Authentication** - Sign up, sign in with NextAuth.js
- **Skills Management** - Skills with trending data
- **Credentials Management** - CRUD operations
- **Job Applications** - Application tracking (API exists)

### ⚠️ Partially Implemented (Using Mock Data)
- **Discover Page** - Search not fully connected to API
- **Network Pages** - Connections, requests, suggestions (mock data)
- **Notifications** - Mock data, no real-time updates
- **Settings** - Not persisted to database
- **Verify Page** - Credential verification stubbed
- **Skills Detail** - Uses mock data
- **Credentials Detail** - Uses mock data
- **Job Detail** - Uses mock data


## 📊 Current Status

- **Pages Created**: 18/22 (82%)
- **Pages with Real API**: 5/18 (28%)
- **API Routes Created**: 12/25 (48%)
- **Overall Completion**: ~45%

### Critical Issues
1. **Database Connectivity** - Prisma connection issues (blocker)
2. **Mock Data** - Many pages still use mock data
3. **Missing API Endpoints** - Network, notifications, search need completion
4. **Real-time Features** - WebSocket not implemented

*For detailed status, see [APP_COMPLETION_STATUS.md](./APP_COMPLETION_STATUS.md)*

## 🤝 Contributing

We welcome contributions!
1.  **Found a bug?** Open an issue.
2.  **Want to add a feature?** Fork the repo, make changes, and open a Pull Request (PR).
3.  **Need help?** Check [SETUP.md](./SETUP.md) or [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 📄 License

Proprietary and Confidential.
© 2025 The Bridge Platform.

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

The application is now **Production-Ready** with full backend integration!
*   **Frontend**: Modern Next.js 16 App Router with TypeScript
*   **Backend**: Complete REST API with Next.js API routes
*   **Database**: PostgreSQL with Prisma ORM
*   **Authentication**: NextAuth.js with credentials provider
*   **Data**: All data is persisted in a real database

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

The system uses a comprehensive database schema with these core concepts:
*   **Users**: The central entity with authentication and profiles.
*   **Skills**: The currency of the platform with trending data.
*   **Credentials**: Blockchain-verifiable proof of skills.
*   **Opportunities**: Jobs/Internships with AI-powered matching.
*   **Projects**: Portfolio projects with media and collaborators.
*   **Applications**: Job application tracking.
*   **Connections**: Professional networking.

*For the full database schema, read `DATABASE_ARCHITECTURE.md`.*

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

---

## 🎯 Features

### ✅ Implemented
- User authentication (sign up, sign in)
- User profiles with learner data
- Skills management with trending data
- Projects portfolio with media
- Credentials management
- Job opportunities with AI matching
- Job applications
- Protected routes and middleware
- RESTful API with full CRUD operations
- Database persistence with Prisma ORM

### 🚧 Coming Soon
- Network/connections features
- Real-time notifications
- File uploads for project media
- Blockchain credential verification
- Career path recommendations
- Advanced search functionality

## 🤝 Contributing

We welcome contributions!
1.  **Found a bug?** Open an issue.
2.  **Want to add a feature?** Fork the repo, make changes, and open a Pull Request (PR).
3.  **Need help?** Check [SETUP.md](./SETUP.md) or [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 📄 License

Proprietary and Confidential.
© 2025 The Bridge Platform.

# 🌉 The Bridge Platform

> **Connecting students to careers through verified credentials and AI-powered guidance.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-green)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Required-blue)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [Backend Connection](#-backend-connection)
- [Project Structure](#-project-structure)
- [Development Guide](#-development-guide)
- [Known Issues & TODOs](#-known-issues--todos)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**The Bridge Platform** is a comprehensive learner platform designed to connect students with career opportunities through verified credentials, AI-powered career navigation, and professional networking. Think of it as LinkedIn for students, but with blockchain-backed credential verification and intelligent skill matching.

### Who is it for?

- **Students**: Build verified portfolios, discover career paths, and connect with opportunities
- **Employers**: Find talent with verified skills and credentials
- **Institutions**: Issue digital credentials that are trusted in the job market

### Current Status

**Phase**: High-Fidelity Prototype → Production-Ready Development

- ✅ **Frontend**: Fully functional UI with modern design
- ✅ **Database Schema**: Complete Prisma schema with 27 models
- ✅ **Service Layer**: Business logic services implemented
- ⚠️ **Backend**: Partially implemented (needs database connection)
- ⚠️ **Authentication**: Not yet implemented
- ⚠️ **Data**: Currently using mock data (ready to switch to database)

---

## 🚀 Key Features

### 1. 🎓 Smart Dashboard
Personalized career command center featuring:
- **Job Matching**: AI-powered opportunity matching based on skills
- **Trending Skills**: Real-time market insights with growth metrics
- **Quick Actions**: Fast access to key features
- **Activity Feed**: Personalized updates and recommendations

### 2. 🎒 Credential Wallet
Digital credential management with:
- **Blockchain Verification**: Immutable credential records
- **QR Code Verification**: Instant credential validation
- **Multiple Credential Types**: Certifications, degrees, badges, course completions
- **Skill Association**: Link credentials to specific skills

### 3. 🧭 Career Navigator
Intelligent career path planning:
- **Pathfinding**: Step-by-step career progression maps
- **Skill Gap Analysis**: Identify missing skills for target roles
- **Learning Recommendations**: Curated courses to fill gaps
- **Salary Projections**: Market-based salary insights

### 4. 📂 Project Portfolio
Showcase your work:
- **Rich Media Support**: Images, videos, and documents
- **Collaborator Tracking**: Team project management
- **Endorsements**: Peer and mentor validation
- **GitHub Integration**: Link repositories and live demos

### 5. 🌐 Professional Networking
Build your professional network:
- **Connection Management**: Connect with peers, mentors, and recruiters
- **Smart Suggestions**: AI-powered connection recommendations
- **Mutual Connections**: Discover shared networks
- **Direct Messaging**: In-platform communication

### 6. 💼 Opportunity Discovery
Find your next role:
- **Advanced Filtering**: By type, location, remote, skills
- **Match Scoring**: Percentage-based skill matching
- **Application Tracking**: Monitor application status
- **Deadline Alerts**: Never miss an opportunity

---

## 🏗️ Architecture

<<<<<<< HEAD
### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  Next.js 16 (App Router) + React 19 + TypeScript            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Hooks      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Routes   │  │Server Actions│  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │User Service  │  │Skill Service │  │Opportunity   │      │
│  └──────────────┘  └──────────────┘  │Service       │      │
│                                       └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                         │
│                    Prisma ORM                                │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│                  PostgreSQL Database                         │
└─────────────────────────────────────────────────────────────┘
=======
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
>>>>>>> main
```

### Data Flow

<<<<<<< HEAD
1. **User Request** → Frontend Component
2. **Component** → API Route / Server Action
3. **API/Action** → Service Layer (Business Logic)
4. **Service** → Prisma Client (Data Access)
5. **Prisma** → PostgreSQL Database
6. **Response** flows back through the layers
=======
The system uses a comprehensive database schema with these core concepts:
*   **Users**: The central entity with authentication and profiles.
*   **Skills**: The currency of the platform with trending data.
*   **Credentials**: Blockchain-verifiable proof of skills.
*   **Opportunities**: Jobs/Internships with AI-powered matching.
*   **Projects**: Portfolio projects with media and collaborators.
*   **Applications**: Job application tracking.
*   **Connections**: Professional networking.

*For the full database schema, read `DATABASE_ARCHITECTURE.md`.*
>>>>>>> main

---

## 💻 Technology Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5
- **UI Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes + Server Actions
- **ORM**: [Prisma](https://www.prisma.io/) 5.22.0
- **Database**: PostgreSQL (required)
- **Validation**: Zod schemas

### Development Tools
- **Package Manager**: npm / pnpm
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Build Tool**: Next.js built-in (Turbopack)

---

## 🚀 Getting Started

### Prerequisites
<<<<<<< HEAD

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **npm** or **pnpm** (comes with Node.js)
=======
*   **Node.js** (Version 18 or higher) installed.
*   **PostgreSQL** database (local or cloud).
*   **Git** installed.
>>>>>>> main

### Quick Setup

<<<<<<< HEAD
1. **Clone the repository**
   ```bash
   git clone https://github.com/TommyBangs/thebridgesl.git
   cd thebridgesl
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your DATABASE_URL
   ```

4. **Set up the database** (see [Database Setup](#-database-setup) below)

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database** (optional)
   ```bash
   npx prisma db seed
   ```

7. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

8. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

9. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

### Step 1: Install PostgreSQL

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember your postgres user password

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

1. **Open PostgreSQL command line**
   ```bash
   psql -U postgres
   ```

2. **Create database and user**
   ```sql
   CREATE DATABASE bridge_platform;
   CREATE USER bridge_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE bridge_platform TO bridge_user;
   \q
   ```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://bridge_user:your_secure_password@localhost:5432/bridge_platform?schema=public"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Add other environment variables as needed
```

### Step 4: Run Migrations

```bash
# Create and apply migrations
npx prisma migrate dev --name init

# This will:
# 1. Create migration files in prisma/migrations/
# 2. Apply migrations to your database
# 3. Generate Prisma Client
```

### Step 5: Seed Database (Optional)

```bash
npx prisma db seed
```

This will populate your database with sample data including:
- Sample user (Alex Chen)
- Trending skills
- Job opportunities
- Sample projects

### Step 6: Verify Database Connection

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) where you can browse your database.

---

## 🔌 Backend Connection

### Current Status

The backend is **partially implemented**. Here's what's done and what needs to be completed:

#### ✅ Completed
- Prisma schema with 27 models
- Service layer (`lib/services/`)
- API route structure (`app/api/`)
- Server Actions (`app/actions/`)
- Database connection setup (`lib/db.ts`)

#### ⚠️ Needs Implementation

1. **Database Connection**
   - ✅ Prisma client configured
   - ⚠️ Environment variable setup needed
   - ⚠️ Database migrations needed

2. **Authentication System**
   - ❌ Password hashing (bcrypt/argon2)
   - ❌ Session management (NextAuth.js or JWT)
   - ❌ Login/logout endpoints
   - ❌ Protected routes middleware

3. **Replace Mock Data**
   - ⚠️ Update components to use service layer
   - ⚠️ Remove mock data imports
   - ⚠️ Add error handling

4. **API Validation**
   - ⚠️ Add Zod schemas to API routes
   - ⚠️ Input validation
   - ⚠️ Error responses

### Steps to Complete Backend Connection

#### 1. Fix Password Hashing

**File**: `app/api/users/route.ts` and `app/actions/user-actions.ts`

**Current Issue**: Passwords are stored in plain text

**Solution**: Install and use bcrypt

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

Then update the code:

```typescript
import bcrypt from 'bcryptjs'

// In POST handler
const passwordHash = await bcrypt.hash(body.password, 10)
```

#### 2. Implement Authentication

**Recommended**: Use NextAuth.js

```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { userService } from '@/lib/services/user-service'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null
        
        const user = await userService.getUserByEmail(credentials.email)
        if (!user) return null
        
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null
        
        return { id: user.id, email: user.email, name: user.name }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

#### 3. Update Components to Use Real Data

**Example**: Update dashboard page

**Before** (using mock data):
```typescript
import { mockTrendingSkills } from '@/lib/mock-data'
```

**After** (using service):
```typescript
import { skillService } from '@/lib/services/skill-service'

const trendingSkills = await skillService.getTrendingSkills()
```

#### 4. Add Error Handling

Wrap service calls in try-catch blocks:

```typescript
try {
  const data = await service.getData()
  return data
} catch (error) {
  console.error('Service error:', error)
  throw new Error('Failed to fetch data')
}
```

#### 5. Add API Validation

Use Zod schemas:

```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(['student', 'institution', 'employer'])
})

// In API route
const validatedData = createUserSchema.parse(body)
```

---

## 📂 Project Structure

```
thebridgesl/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── profile/              # User profile management
│   │   ├── career/               # Career navigator
│   │   ├── projects/             # Portfolio projects
│   │   ├── credentials/          # Credential wallet
│   │   ├── network/              # Networking features
│   │   ├── jobs/                 # Job opportunities
│   │   ├── skills/               # Skills management
│   │   ├── discover/             # Discovery feed
│   │   ├── notifications/        # Notifications
│   │   └── settings/             # User settings
│   ├── api/                      # API routes
│   │   └── users/route.ts        # User API endpoints
│   ├── actions/                  # Server Actions
│   │   └── user-actions.ts       # User-related actions
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── opportunity-card.tsx
│   │   ├── quick-action-card.tsx
│   │   └── trending-skill-card.tsx
│   ├── dialogs/                  # Modal dialogs
│   │   ├── add-project-dialog.tsx
│   │   ├── apply-job-dialog.tsx
│   │   └── verify-skill-dialog.tsx
│   └── shared/                   # Shared components
│       ├── header.tsx
│       ├── sidebar.tsx
│       ├── mobile-nav.tsx
│       └── ...
│
├── lib/                          # Utilities & services
│   ├── db.ts                     # Prisma client singleton
│   ├── services/                 # Business logic services
│   │   ├── user-service.ts       # User operations
│   │   ├── skill-service.ts      # Skill operations
│   │   └── opportunity-service.ts # Opportunity operations
│   ├── mock-data.ts              # Mock data (to be replaced)
│   ├── constants.ts              # App constants
│   ├── utils.ts                  # Utility functions
│   └── validators.ts             # Zod validation schemas
│
├── prisma/                       # Database schema
│   ├── schema.prisma             # Prisma schema (27 models)
│   ├── seed.ts                   # Database seeding script
│   └── migrations/               # Database migrations
│
├── types/                        # TypeScript definitions
│   └── index.ts                  # All type definitions
│
├── hooks/                        # React hooks
│   ├── use-debounce.ts
│   ├── use-local-storage.ts
│   └── use-toast.ts
│
├── public/                       # Static assets
│   └── [images, logos, etc.]
│
├── scripts/                      # Utility scripts
│   ├── 01-create-tables.sql      # Manual SQL schema (legacy)
│   └── 02-seed-data.sql          # Manual SQL seed (legacy)
│
├── .env                          # Environment variables (create this)
├── .env.example                  # Environment variable template
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── components.json               # shadcn/ui configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🛠️ Development Guide

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma Client
npx prisma db seed        # Seed database
npx prisma db push        # Push schema changes (dev only)

# Type Checking
npm run type-check   # Run TypeScript type checking
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with TypeScript
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Absolute imports using `@/` alias

### Database Migrations

When you modify the Prisma schema:

```bash
# 1. Edit prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name describe_your_changes

# 3. Prisma will:
#    - Generate migration SQL
#    - Apply migration to database
#    - Regenerate Prisma Client
```

### Adding New Features

1. **Update Prisma Schema** (if needed)
   ```bash
   # Edit prisma/schema.prisma
   npx prisma migrate dev --name add_new_feature
   ```

2. **Create Service** (business logic)
   ```typescript
   // lib/services/new-service.ts
   import db from '@/lib/db'
   
   export const newService = {
     async getData() {
       return await db.model.findMany()
     }
   }
   ```

3. **Create API Route or Server Action**
   ```typescript
   // app/api/new-feature/route.ts
   import { newService } from '@/lib/services/new-service'
   
   export async function GET() {
     const data = await newService.getData()
     return Response.json(data)
   }
   ```

4. **Create UI Component**
   ```typescript
   // components/new-feature/component.tsx
   export function NewFeature() {
     // Component logic
   }
   ```

5. **Add to Page**
   ```typescript
   // app/(dashboard)/new-feature/page.tsx
   import { NewFeature } from '@/components/new-feature/component'
   ```

---

## ⚠️ Known Issues & TODOs

### Critical Issues

1. **Password Security** 🔴
   - **Issue**: Passwords stored in plain text
   - **Location**: `app/api/users/route.ts`, `app/actions/user-actions.ts`
   - **Fix**: Implement bcrypt hashing (see [Backend Connection](#-backend-connection))

2. **Authentication Missing** 🔴
   - **Issue**: No login/logout system
   - **Fix**: Implement NextAuth.js or JWT-based auth

3. **Database Connection** 🟡
   - **Issue**: Not connected to real database
   - **Fix**: Set up PostgreSQL and configure `DATABASE_URL`

### Medium Priority

4. **Mock Data Usage** 🟡
   - **Issue**: Components still use mock data
   - **Fix**: Replace with service layer calls

5. **Error Handling** 🟡
   - **Issue**: Limited error handling in services
   - **Fix**: Add comprehensive try-catch blocks and error types

6. **Input Validation** 🟡
   - **Issue**: API routes lack validation
   - **Fix**: Add Zod schemas to all endpoints

### Low Priority

7. **Type Safety** 🟢
   - **Issue**: Some `any` types in codebase
   - **Fix**: Add proper TypeScript types

8. **Testing** 🟢
   - **Issue**: No tests written
   - **Fix**: Add unit and integration tests

9. **Documentation** 🟢
   - **Issue**: API documentation missing
   - **Fix**: Add OpenAPI/Swagger documentation

---

## 🔧 Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solutions**:
1. Verify PostgreSQL is running: `pg_isready` or check services
2. Check `DATABASE_URL` in `.env` file
3. Verify database exists: `psql -U postgres -l`
4. Check firewall settings

**Error**: `P1001: Can't reach database server at 'localhost:5432'`

**Solutions**:
1. Ensure PostgreSQL is installed and running
2. Check if port 5432 is available
3. Verify connection string format: `postgresql://user:password@host:port/database`

### Prisma Issues

**Error**: `PrismaClient is not configured`

**Solution**:
```bash
npx prisma generate
```

**Error**: `Migration failed`

**Solution**:
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or manually fix migration
npx prisma migrate dev
```

### Build Issues

**Error**: TypeScript errors during build

**Solution**:
```bash
# Check for type errors
npm run type-check

# Fix errors or temporarily ignore (not recommended)
# See next.config.mjs - typescript.ignoreBuildErrors
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Database Architecture
See `DATABASE_ARCHITECTURE.md` for detailed database schema documentation.

### API Reference
API documentation coming soon. For now, see:
- `app/api/` - API route handlers
- `lib/services/` - Service layer (business logic)
=======
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
>>>>>>> main

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

<<<<<<< HEAD
We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass
=======
We welcome contributions!
1.  **Found a bug?** Open an issue.
2.  **Want to add a feature?** Fork the repo, make changes, and open a Pull Request (PR).
3.  **Need help?** Check [SETUP.md](./SETUP.md) or [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
>>>>>>> main

---

## 📄 License

Proprietary and Confidential.

© 2025 The Bridge Platform. All rights reserved.

---

## 📞 Support

For questions, issues, or contributions:
- **Issues**: [GitHub Issues](https://github.com/TommyBangs/thebridgesl/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TommyBangs/thebridgesl/discussions)

---

**Built with ❤️ by The Bridge Team**

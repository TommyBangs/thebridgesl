# Bridge Platform

A production-ready, scalable learner platform connecting students with career opportunities through verified credentials, AI-powered career navigation, and professional networking.

## Features

- **Intelligent Dashboard**: Real-time personalized job recommendations and trending skills
- **Credential Wallet**: Blockchain-verified credentials with QR code sharing
- **Career Navigator**: AI-powered career path exploration and skills gap analysis
- **Project Portfolio**: Showcase verified projects with multimedia support
- **Professional Network**: Connect with peers, alumni, and industry mentors
- **Discovery Hub**: Explore opportunities, courses, and industry insights
- **Verification System**: Secure credential verification and sharing

## Tech Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui with custom Bridge theme
- **State Management**: SWR for data fetching and caching
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/bridge-platform.git

# Navigate to project directory
cd bridge-platform

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

\`\`\`
bridge-platform/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard layout group
│   ├── api/               # API routes
│   └── globals.css        # Global styles with design tokens
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── dashboard/        # Dashboard-specific components
│   ├── career/           # Career navigator components
│   └── shared/           # Shared components
├── lib/                   # Utility functions
│   ├── api-client.ts     # API client with error handling
│   ├── constants.ts      # Application constants
│   ├── format.ts         # Formatting utilities
│   ├── validators.ts     # Validation functions
│   └── mock-data.ts      # Mock data for development
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core types
├── hooks/                 # Custom React hooks
└── public/               # Static assets
\`\`\`

## Development

### Type Checking

\`\`\`bash
npm run type-check
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

### Testing

\`\`\`bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
\`\`\`

## Design System

The platform uses a custom design system based on the Bridge brand:

- **Primary Color**: Teal/Cyan (oklch(0.55 0.15 195))
- **Typography**: Geist for body text, Geist Mono for code
- **Spacing**: Consistent 4px grid system
- **Radius**: 0.75rem base radius

See `app/globals.css` for full design token definitions.

## API Documentation

API routes follow RESTful conventions:

- `GET /api/skills` - Fetch user skills
- `POST /api/projects` - Create new project
- `GET /api/opportunities` - Fetch job opportunities
- `POST /api/verify` - Verify credential

See individual route files in `app/api/` for detailed documentation.

## Deployment

The application is optimized for deployment on Vercel:

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, email support@bridge-platform.com or open an issue in the repository.

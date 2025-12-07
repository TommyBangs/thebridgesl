/**
 * Application-wide constants
 * @module lib/constants
 */

// ============================================================================
// App Configuration
// ============================================================================

export const APP_NAME = "Bridge" as const
export const APP_DESCRIPTION = "Connect Your Skills to Opportunities" as const
export const APP_VERSION = "1.0.0" as const

// ============================================================================
// API Configuration
// ============================================================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"
export const API_TIMEOUT = 30000 // 30 seconds

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",

  // Users
  USER: "/users",
  LEARNER_PROFILE: "/users/learner-profile",

  // Skills
  SKILLS: "/skills",
  TRENDING_SKILLS: "/skills/trending",
  VERIFY_SKILL: "/skills/verify",

  // Credentials
  CREDENTIALS: "/credentials",
  GENERATE_QR: "/credentials/qr",
  VERIFY_CREDENTIAL: "/credentials/verify",

  // Projects
  PROJECTS: "/projects",
  PROJECT_VALIDATE: "/projects/validate",

  // Career
  CAREER_PATHS: "/career/paths",
  SKILLS_GAP: "/career/skills-gap",
  JOB_MATCHES: "/career/job-matches",
  SALARY_PROJECTION: "/career/salary-projection",

  // Opportunities
  OPPORTUNITIES: "/opportunities",
  FEATURED_OPPORTUNITIES: "/opportunities/featured",

  // Network
  CONNECTIONS: "/network/connections",
  SUGGESTIONS: "/network/suggestions",
  MENTORS: "/network/mentors",

  // Feed
  FEED: "/feed",
  INSIGHTS: "/feed/insights",

  // Courses
  COURSES: "/courses",
  RECOMMENDATIONS: "/courses/recommendations",
} as const

// ============================================================================
// Navigation Routes
// ============================================================================

export const ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  CAREER_NAVIGATOR: "/career",
  PROJECTS: "/projects",
  NETWORK: "/network",
  DISCOVER: "/discover",
  VERIFY: "/verify",
  SETTINGS: "/settings",
  NOTIFICATIONS: "/notifications",
} as const

// ============================================================================
// Skill Categories
// ============================================================================

export const SKILL_CATEGORIES = [
  { value: "technical", label: "Technical Skills" },
  { value: "soft-skill", label: "Soft Skills" },
  { value: "domain-knowledge", label: "Domain Knowledge" },
  { value: "tools", label: "Tools & Platforms" },
  { value: "languages", label: "Programming Languages" },
] as const

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner", color: "blue" },
  { value: "intermediate", label: "Intermediate", color: "cyan" },
  { value: "advanced", label: "Advanced", color: "teal" },
  { value: "expert", label: "Expert", color: "emerald" },
] as const

// ============================================================================
// Opportunity Types
// ============================================================================

export const OPPORTUNITY_TYPES = [
  { value: "job", label: "Full-time Job", icon: "briefcase" },
  { value: "internship", label: "Internship", icon: "graduation-cap" },
  { value: "project", label: "Project", icon: "code" },
  { value: "freelance", label: "Freelance", icon: "clock" },
  { value: "mentorship", label: "Mentorship", icon: "users" },
] as const

// ============================================================================
// Status & Badge Colors
// ============================================================================

export const STATUS_COLORS = {
  verified: "emerald",
  pending: "amber",
  unverified: "gray",
  active: "green",
  inactive: "gray",
  error: "red",
} as const

// ============================================================================
// Chart Colors
// ============================================================================

export const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
} as const

// ============================================================================
// Pagination
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// ============================================================================
// Date Formats
// ============================================================================

export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  WITH_TIME: "MMM dd, yyyy HH:mm",
  RELATIVE: "relative",
} as const

// ============================================================================
// File Upload
// ============================================================================

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"]
export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"]

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  BIO_MAX_LENGTH: 500,
  PROJECT_TITLE_MAX_LENGTH: 100,
  PROJECT_DESC_MAX_LENGTH: 2000,
} as const

// ============================================================================
// Animation Durations (ms)
// ============================================================================

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

// ============================================================================
// WebSocket Events
// ============================================================================

export const WS_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  FEED_UPDATE: "feed:update",
  NOTIFICATION: "notification",
  SKILL_TRENDING: "skill:trending",
  OPPORTUNITY_NEW: "opportunity:new",
} as const

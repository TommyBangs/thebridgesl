# Bridge Platform - Database Architecture

## Overview
The Bridge platform is a comprehensive learner platform designed to connect students with career opportunities through verified credentials, AI-powered career navigation, and professional networking. This document outlines the complete database schema and entity relationships.

## Core Principles
- **User-Centric Design**: All data relates to user profiles and their activities
- **Verification & Trust**: Blockchain-backed credential verification and endorsement systems
- **Skill-Based Matching**: Advanced matching algorithms for opportunities and connections
- **Data Relationships**: Complex relationships between users, skills, credentials, and opportunities

---

## Database Tables

### 1. **users** (Base Table)
Stores core user information and authentication data.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email for authentication |
| name | VARCHAR(255) | NOT NULL | User's full name |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| avatar | TEXT | NULLABLE | Profile picture URL |
| role | ENUM | NOT NULL | 'student', 'institution', 'employer' |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 2. **learner_profiles** (Extends users)
Extended profile information for student users.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| user_id | UUID | PRIMARY KEY, FK | References users.id |
| bio | TEXT | NULLABLE | Personal bio/about section |
| location | VARCHAR(255) | NULLABLE | Current location |
| university | VARCHAR(255) | NULLABLE | University name |
| major | VARCHAR(255) | NULLABLE | Field of study |
| graduation_year | INTEGER | NULLABLE | Expected graduation year |
| skills_match_percentage | INTEGER | DEFAULT 0 | Percentage match with opportunities |
| verification_status | ENUM | DEFAULT 'unverified' | 'verified', 'pending', 'unverified' |

### 3. **skills** (Catalog Table)
Master catalog of all available skills.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique skill identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Skill name |
| category | ENUM | NOT NULL | 'technical', 'soft-skill', 'domain-knowledge', 'tools', 'languages' |
| description | TEXT | NULLABLE | Detailed skill description |
| verified | BOOLEAN | DEFAULT false | Whether skill requires verification |
| trending | BOOLEAN | DEFAULT false | Whether skill is trending |

### 4. **user_skills** (Many-to-Many)
Maps users to their skills with proficiency levels.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique record identifier |
| user_id | UUID | NOT NULL, FK | References users.id |
| skill_id | UUID | NOT NULL, FK | References skills.id |
| level | ENUM | NOT NULL | 'beginner', 'intermediate', 'advanced', 'expert' |
| endorsements | INTEGER | DEFAULT 0 | Number of endorsements |
| verified | BOOLEAN | DEFAULT false | Whether skill is verified |
| added_at | TIMESTAMP | DEFAULT NOW() | Date skill was added |

**Unique Constraint**: (user_id, skill_id)

### 5. **trending_skills** (Analytics)
Tracks trending data for skills.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| skill_id | UUID | PRIMARY KEY, FK | References skills.id |
| demand_percentage | DECIMAL(5,2) | NOT NULL | Percentage demand in market |
| growth_rate | DECIMAL(5,2) | NOT NULL | YoY growth percentage |
| average_salary | BIGINT | NOT NULL | Average salary in SLL |
| open_positions | INTEGER | NOT NULL | Number of open positions |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

### 6. **credentials** (User Achievements)
Stores earned credentials and certifications.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique credential identifier |
| user_id | UUID | NOT NULL, FK | References users.id |
| title | VARCHAR(255) | NOT NULL | Credential title |
| issuer | VARCHAR(255) | NOT NULL | Issuing organization |
| type | ENUM | NOT NULL | 'certification', 'degree', 'badge', 'course-completion', 'project' |
| issue_date | DATE | NOT NULL | Date credential was issued |
| expiry_date | DATE | NULLABLE | Expiration date (if applicable) |
| verified | BOOLEAN | DEFAULT false | Whether verified on blockchain |
| blockchain_hash | VARCHAR(255) | NULLABLE | Blockchain transaction hash |
| qr_code | TEXT | NULLABLE | QR code for verification |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |

### 7. **credential_skills** (Many-to-Many)
Links credentials to associated skills.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| credential_id | UUID | NOT NULL, FK | References credentials.id |
| skill_id | UUID | NOT NULL, FK | References skills.id |

**Primary Key**: (credential_id, skill_id)

### 8. **projects** (Portfolio)
User portfolio projects.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique project identifier |
| user_id | UUID | NOT NULL, FK | References users.id |
| title | VARCHAR(255) | NOT NULL | Project title |
| description | TEXT | NOT NULL | Detailed description |
| visibility | ENUM | NOT NULL | 'public', 'private', 'connections' |
| verified | BOOLEAN | DEFAULT false | Whether project is verified |
| github_url | TEXT | NULLABLE | GitHub repository link |
| live_url | TEXT | NULLABLE | Live project URL |
| start_date | DATE | NOT NULL | Project start date |
| end_date | DATE | NULLABLE | Project end date |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 9. **project_media** (One-to-Many)
Media files associated with projects.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique media identifier |
| project_id | UUID | NOT NULL, FK | References projects.id |
| type | ENUM | NOT NULL | 'image', 'video', 'document' |
| url | TEXT | NOT NULL | Media file URL |
| thumbnail | TEXT | NULLABLE | Thumbnail URL |
| caption | VARCHAR(255) | NULLABLE | Media caption |
| display_order | INTEGER | DEFAULT 0 | Display order |

### 10. **project_skills** (Many-to-Many)
Skills used in projects.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| project_id | UUID | NOT NULL, FK | References projects.id |
| skill_id | UUID | NOT NULL, FK | References skills.id |

**Primary Key**: (project_id, skill_id)

### 11. **project_collaborators** (Many-to-Many)
Users collaborating on projects.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| project_id | UUID | NOT NULL, FK | References projects.id |
| user_id | UUID | NOT NULL, FK | References users.id |
| role | VARCHAR(255) | NULLABLE | Role in project |
| joined_at | TIMESTAMP | DEFAULT NOW() | Date joined project |

**Primary Key**: (project_id, user_id)

### 12. **endorsements** (Social Proof)
Endorsements on projects and skills.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique endorsement identifier |
| target_id | UUID | NOT NULL | Project or skill ID |
| target_type | ENUM | NOT NULL | 'project' or 'skill' |
| endorser_id | UUID | NOT NULL, FK | References users.id (endorser) |
| comment | TEXT | NULLABLE | Endorsement comment |
| created_at | TIMESTAMP | DEFAULT NOW() | Date of endorsement |

### 13. **opportunities** (Jobs & Internships)
Available job and internship opportunities.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique opportunity identifier |
| title | VARCHAR(255) | NOT NULL | Job title |
| company | VARCHAR(255) | NOT NULL | Company name |
| company_logo | TEXT | NULLABLE | Company logo URL |
| type | ENUM | NOT NULL | 'job', 'internship', 'project', 'freelance', 'mentorship' |
| location | VARCHAR(255) | NOT NULL | Job location |
| remote | BOOLEAN | DEFAULT false | Whether position is remote |
| description | TEXT | NOT NULL | Detailed job description |
| salary_min | BIGINT | NULLABLE | Minimum salary in SLL |
| salary_max | BIGINT | NULLABLE | Maximum salary in SLL |
| posted_date | TIMESTAMP | NOT NULL | Date opportunity was posted |
| deadline | DATE | NULLABLE | Application deadline |
| application_url | TEXT | NULLABLE | Application link |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |

### 14. **opportunity_requirements** (One-to-Many)
Job requirements for opportunities.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique requirement identifier |
| opportunity_id | UUID | NOT NULL, FK | References opportunities.id |
| requirement | TEXT | NOT NULL | Specific requirement |
| display_order | INTEGER | DEFAULT 0 | Display order |

### 15. **opportunity_skills** (Many-to-Many)
Required skills for opportunities.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| opportunity_id | UUID | NOT NULL, FK | References opportunities.id |
| skill_id | UUID | NOT NULL, FK | References skills.id |

**Primary Key**: (opportunity_id, skill_id)

### 16. **applications** (User Applications)
Tracks user applications to opportunities.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique application identifier |
| user_id | UUID | NOT NULL, FK | References users.id |
| opportunity_id | UUID | NOT NULL, FK | References opportunities.id |
| status | ENUM | NOT NULL | 'applied', 'viewed', 'shortlisted', 'rejected', 'accepted' |
| cover_letter | TEXT | NULLABLE | Application cover letter |
| resume_url | TEXT | NULLABLE | Resume/CV URL |
| applied_at | TIMESTAMP | DEFAULT NOW() | Application date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last status update |

**Unique Constraint**: (user_id, opportunity_id)

### 17. **connections** (Network Graph)
User connections and network relationships.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique connection identifier |
| user_id | UUID | NOT NULL, FK | References users.id (initiator) |
| connected_user_id | UUID | NOT NULL, FK | References users.id (recipient) |
| type | ENUM | NOT NULL | 'peer', 'alumni', 'mentor', 'recruiter', 'colleague' |
| mutual_connections | INTEGER | DEFAULT 0 | Number of mutual connections |
| connected_at | TIMESTAMP | DEFAULT NOW() | Connection date |

**Unique Constraint**: (user_id, connected_user_id)

### 18. **connection_requests** (Pending Connections)
Pending connection requests.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique request identifier |
| sender_id | UUID | NOT NULL, FK | References users.id |
| receiver_id | UUID | NOT NULL, FK | References users.id |
| message | TEXT | NULLABLE | Request message |
| status | ENUM | NOT NULL | 'pending', 'accepted', 'declined' |
| requested_at | TIMESTAMP | DEFAULT NOW() | Request date |
| responded_at | TIMESTAMP | NULLABLE | Response date |

**Unique Constraint**: (sender_id, receiver_id) - only one pending request per pair

### 19. **feed_items** (Activity Feed)
User feed items and notifications.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique feed item identifier |
| type | ENUM | NOT NULL | 'opportunity', 'skill-trending', 'network-activity', 'insight', 'recommendation', 'achievement' |
| user_id | UUID | NOT NULL, FK | References users.id |
| priority | ENUM | NOT NULL | 'high', 'medium', 'low' |
| title | VARCHAR(255) | NOT NULL | Feed item title |
| description | TEXT | NOT NULL | Feed item description |
| image | TEXT | NULLABLE | Associated image URL |
| data | JSONB | NULLABLE | Additional data (flexible structure) |
| timestamp | TIMESTAMP | DEFAULT NOW() | Feed item timestamp |

### 20. **notifications** (User Notifications)
User notifications for various events.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique notification identifier |
| user_id | UUID | NOT NULL, FK | References users.id |
| type | ENUM | NOT NULL | 'opportunity', 'connection', 'skill', 'project', 'credential', 'trending' |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| read | BOOLEAN | DEFAULT false | Whether notification is read |
| action_url | TEXT | NULLABLE | URL to take action |
| icon | VARCHAR(50) | NULLABLE | Icon identifier |
| timestamp | TIMESTAMP | DEFAULT NOW() | Notification timestamp |

### 21. **career_paths** (Career Navigation)
Career progression paths for users.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique career path identifier |
| user_id | UUID | NOT NULL, FK | References users.id |
| current_role | VARCHAR(255) | NOT NULL | Current job title |
| target_role | VARCHAR(255) | NOT NULL | Target job title |
| estimated_duration | INTEGER | NOT NULL | Estimated duration in months |
| created_at | TIMESTAMP | DEFAULT NOW() | Path creation date |

### 22. **career_path_nodes** (Career Stages)
Individual stages in career paths.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique node identifier |
| career_path_id | UUID | NOT NULL, FK | References career_paths.id |
| stage_number | INTEGER | NOT NULL | Order in path |
| title | VARCHAR(255) | NOT NULL | Stage title |
| duration | INTEGER | NOT NULL | Duration in months |
| completed | BOOLEAN | DEFAULT false | Whether stage is completed |

### 23. **skill_gaps** (Learning Recommendations)
Identified skill gaps with learning recommendations.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique skill gap identifier |
| career_path_id | UUID | NOT NULL, FK | References career_paths.id |
| skill_id | UUID | NOT NULL, FK | References skills.id |
| current_level | ENUM | NOT NULL | Current skill level |
| target_level | ENUM | NOT NULL | Target skill level |
| priority | ENUM | NOT NULL | 'high', 'medium', 'low' |

### 24. **courses** (Learning Resources)
Available courses for skill development.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique course identifier |
| title | VARCHAR(255) | NOT NULL | Course title |
| provider | VARCHAR(255) | NOT NULL | Course provider |
| description | TEXT | NOT NULL | Course description |
| thumbnail | TEXT | NULLABLE | Course thumbnail URL |
| duration | INTEGER | NOT NULL | Duration in hours |
| level | ENUM | NOT NULL | 'beginner', 'intermediate', 'advanced', 'expert' |
| rating | DECIMAL(3,2) | DEFAULT 0 | Course rating (0-5) |
| review_count | INTEGER | DEFAULT 0 | Number of reviews |
| price | BIGINT | NOT NULL | Price in SLL |
| url | TEXT | NOT NULL | Course link |

### 25. **course_skills** (Many-to-Many)
Skills covered by courses.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| course_id | UUID | NOT NULL, FK | References courses.id |
| skill_id | UUID | NOT NULL, FK | References skills.id |

**Primary Key**: (course_id, skill_id)

### 26. **verification_requests** (Blockchain Verification)
Credential verification requests.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique request identifier |
| credential_id | UUID | NOT NULL, FK | References credentials.id |
| requested_by | UUID | NOT NULL, FK | References users.id |
| status | ENUM | NOT NULL | 'pending', 'approved', 'rejected' |
| requested_at | TIMESTAMP | DEFAULT NOW() | Request date |
| processed_at | TIMESTAMP | NULLABLE | Processing date |
| blockchain_hash | VARCHAR(255) | NULLABLE | Blockchain verification hash |

### 27. **messages** (Messaging System)
Direct messages between users.

| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| id | UUID | PRIMARY KEY | Unique message identifier |
| sender_id | UUID | NOT NULL, FK | References users.id |
| receiver_id | UUID | NOT NULL, FK | References users.id |
| content | TEXT | NOT NULL | Message content |
| read | BOOLEAN | DEFAULT false | Whether message is read |
| sent_at | TIMESTAMP | DEFAULT NOW() | Message send time |

---

## Entity Relationship Diagram (ERD)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                         Core User Management                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  users (PK: id)                                                      │
│  ├── email (UNIQUE)                                                  │
│  ├── name                                                            │
│  ├── role: student|institution|employer                             │
│  └── timestamp: created_at, updated_at                              │
│       │                                                              │
│       ├─── 1:1 ──> learner_profiles (extends for students)          │
│       │             ├── bio, location, university                   │
│       │             └── verification_status, skills_match%          │
│       │                                                              │
│       ├─── 1:N ──> user_skills (M:M with skills)                   │
│       │             └── level, endorsements, verified               │
│       │                                                              │
│       ├─── 1:N ──> credentials                                      │
│       │             ├── type, issuer, dates                         │
│       │             ├── verified, blockchain_hash                   │
│       │             └─── M:M ──> credential_skills                  │
│       │                                                              │
│       ├─── 1:N ──> projects                                         │
│       │             ├── title, description, visibility              │
│       │             ├── github_url, live_url                        │
│       │             ├─── 1:N ──> project_media                      │
│       │             ├─── M:M ──> project_skills                     │
│       │             ├─── M:M ──> project_collaborators              │
│       │             └─── 1:N ──> endorsements                       │
│       │                                                              │
│       ├─── 1:N ──> applications                                     │
│       │             └── opportunity_id, status, resume              │
│       │                                                              │
│       ├─── 1:N ──> connections (M:M relationships)                  │
│       │             └── type, mutual_connections, connected_at      │
│       │                                                              │
│       ├─── 1:N ──> connection_requests                              │
│       │             ├── sender_id, receiver_id                      │
│       │             └── status, message, timestamp                  │
│       │                                                              │
│       ├─── 1:N ──> feed_items                                       │
│       │             └── type, priority, content, data               │
│       │                                                              │
│       ├─── 1:N ──> notifications                                    │
│       │             └── type, title, message, read                  │
│       │                                                              │
│       ├─── 1:N ──> career_paths                                     │
│       │             ├── current_role, target_role                   │
│       │             ├─── 1:N ──> career_path_nodes                  │
│       │             └─── 1:N ──> skill_gaps ──> skills              │
│       │                                                              │
│       └─── 1:N ──> messages (M:M conversations)                     │
│                     └── content, read, sent_at                      │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                     Skills & Opportunities                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  skills (PK: id)                                                     │
│  ├── name (UNIQUE)                                                   │
│  ├── category: technical|soft-skill|domain-knowledge|tools|lang     │
│  ├── description, verified, trending                                │
│  └─── 1:1 ──> trending_skills                                       │
│              ├── demand%, growth_rate                               │
│              ├── average_salary                                      │
│              └── open_positions                                      │
│       │                                                              │
│       ├── Referenced by: user_skills (M:M)                          │
│       ├── Referenced by: project_skills (M:M)                       │
│       ├── Referenced by: opportunity_skills (M:M)                   │
│       ├── Referenced by: credential_skills (M:M)                    │
│       └── Referenced by: course_skills (M:M)                        │
│                                                                       │
│  opportunities (PK: id)                                              │
│  ├── title, company, type: job|internship|project|freelance|mentor  │
│  ├── location, remote, description                                  │
│  ├── salary_min, salary_max                                         │
│  ├── posted_date, deadline, application_url                         │
│  ├─── 1:N ──> opportunity_requirements                              │
│  ├─── M:M ──> opportunity_skills ──> skills                         │
│  └─── 1:N ──> applications (from users)                             │
│       └── status: applied|viewed|shortlisted|rejected|accepted      │
│                                                                      │
│  courses (PK: id)                                                    │
│  ├── title, provider, description                                   │
│  ├── duration, level, rating, price                                 │
│  └─── M:M ──> course_skills ──> skills                              │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                     Verification & Trust                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  verification_requests (PK: id)                                      │
│  ├── credential_id (FK)                                             │
│  ├── requested_by (FK to users)                                     │
│  ├── status: pending|approved|rejected                              │
│  ├── blockchain_hash                                                 │
│  └── timestamp: requested_at, processed_at                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## Key Relationships Summary

| Relationship | Type | Purpose |
|--------------|------|---------|
| users ↔ learner_profiles | 1:1 | Extended student profile data |
| users ↔ user_skills | 1:N (M:M) | User skill proficiencies |
| users ↔ credentials | 1:N | User earned credentials |
| users ↔ projects | 1:N | User portfolio projects |
| users ↔ connections | M:M | Network relationships |
| users ↔ applications | 1:N | Job applications |
| projects ↔ endorsements | 1:N | Project endorsements |
| opportunities ↔ applications | 1:N | Job application tracking |
| skills ↔ trending_skills | 1:1 | Market trending data |
| career_paths ↔ skill_gaps | 1:N | Learning recommendations |

---

## Indexing Strategy

### Primary Indexes (Performance Critical)
\`\`\`sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Skill and opportunity searches
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_opportunities_company ON opportunities(company);
CREATE INDEX idx_opportunities_location ON opportunities(location);

-- Connection and messaging
CREATE INDEX idx_connections_user_id ON connections(user_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);

-- Feed and notifications
CREATE INDEX idx_feed_user_timestamp ON feed_items(user_id, timestamp DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- Applications
CREATE INDEX idx_applications_status ON applications(user_id, status);
\`\`\`

### Secondary Indexes (Query Optimization)
\`\`\`sql
-- Trending skills
CREATE INDEX idx_trending_skills_demand ON trending_skills(demand_percentage DESC);
CREATE INDEX idx_trending_skills_growth ON trending_skills(growth_rate DESC);

-- Credentials
CREATE INDEX idx_credentials_verified ON credentials(verified);
CREATE INDEX idx_credentials_type ON credentials(type);

-- Projects
CREATE INDEX idx_projects_visibility ON projects(visibility);

-- Network analysis
CREATE INDEX idx_connections_type ON connections(type);
CREATE INDEX idx_connection_requests_status ON connection_requests(status);
\`\`\`

---

## Data Flow Patterns

### 1. User Registration & Profile Setup
\`\`\`
users → learner_profiles → user_skills → skills
              ↓
        credentials → credential_skills → skills
              ↓
        projects → project_skills → skills
\`\`\`

### 2. Opportunity Matching & Application
\`\`\`
opportunities → opportunity_skills → skills
              ↓
        user_skills (comparison for matching)
              ↓
        match_score calculation
              ↓
        applications (user applies)
              ↓
        notifications (to relevant parties)
\`\`\`

### 3. Network Connection Flow
\`\`\`
users A → connection_requests → users B
              ↓
        (pending state)
              ↓
        (B accepts/declines)
              ↓
        connections (stored as M:M)
              ↓
        messages (direct communication)
\`\`\`

### 4. Career Path Recommendation
\`\`\`
users → career_paths → career_path_nodes
         ↓                      ↓
    skill_gaps → skills ← trending_skills
         ↓
    skill_gap → recommended courses
         ↓
    feed_items (learning recommendations)
\`\`\`

### 5. Credential Verification
\`\`\`
credentials → verification_requests
         ↓
    (blockchain verification)
         ↓
    blockchain_hash (stored)
         ↓
    verified = true
         ↓
    notifications (user notified)
\`\`\`

---

## Data Integrity & Constraints

### Unique Constraints
- `users.email` - One email per user
- `skills.name` - One entry per skill
- `connections` - One connection per user pair
- `user_skills` - One entry per user-skill combination
- `project_collaborators` - One entry per project-user

### Foreign Key Constraints
All foreign keys use:
- `ON DELETE CASCADE` - For extensional tables (like learner_profiles)
- `ON DELETE SET NULL` - For references that should survive deletion
- `ON UPDATE CASCADE` - For all foreign keys

### Check Constraints
\`\`\`sql
-- Salary validation
ALTER TABLE opportunities ADD CONSTRAINT check_salary 
  CHECK (salary_min <= salary_max AND salary_min > 0);

-- Level hierarchy
ALTER TABLE user_skills ADD CONSTRAINT check_levels 
  CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert'));

-- Percentages
ALTER TABLE trending_skills ADD CONSTRAINT check_percentage 
  CHECK (demand_percentage >= 0 AND demand_percentage <= 100);
\`\`\`

---

## Query Patterns & Examples

### Find Matching Opportunities
\`\`\`sql
SELECT o.*, COUNT(DISTINCT os.skill_id) as matched_skills
FROM opportunities o
LEFT JOIN opportunity_skills os ON o.id = os.opportunity_id
LEFT JOIN user_skills us ON os.skill_id = us.skill_id AND us.user_id = ?
WHERE o.location ILIKE ? OR o.remote = true
GROUP BY o.id
ORDER BY matched_skills DESC, o.posted_date DESC;
\`\`\`

### Trending Skills for User's Field
\`\`\`sql
SELECT ts.skill_id, s.name, ts.demand_percentage, ts.growth_rate,
       ts.average_salary, ts.open_positions
FROM trending_skills ts
JOIN skills s ON ts.skill_id = s.id
WHERE s.category IN (
    SELECT DISTINCT category FROM user_skills us
    JOIN skills s ON us.skill_id = s.id
    WHERE us.user_id = ?
)
ORDER BY ts.growth_rate DESC
LIMIT 10;
\`\`\`

### Network Analysis - Mutual Connections
\`\`\`sql
SELECT u.*, c1.mutual_connections
FROM connections c1
JOIN connections c2 ON c1.connected_user_id = c2.user_id 
  AND c2.connected_user_id = c1.user_id
JOIN users u ON c1.connected_user_id = u.id
WHERE c1.user_id = ?;
\`\`\`

### Career Path Progress
\`\`\`sql
SELECT cpn.title, cpn.stage_number, cpn.completed,
       COUNT(CASE WHEN sg.skill_id IS NOT NULL THEN 1 END) as skill_gaps
FROM career_path_nodes cpn
LEFT JOIN skill_gaps sg ON cpn.career_path_id = sg.career_path_id
WHERE cpn.career_path_id = ?
GROUP BY cpn.id
ORDER BY cpn.stage_number;
\`\`\`

---

## Scalability Considerations

### Partitioning Strategy
- **feed_items**: Partition by user_id and timestamp for faster queries
- **notifications**: Partition by user_id for parallel reads
- **applications**: Partition by opportunity_id for analytics

### Archiving Strategy
- Old notifications (>6 months) → Archive table
- Inactive users (>1 year) → Separate archived_users table
- Expired opportunities → Archive for analytics

### Caching Strategy
\`\`\`
Redis Cache Layers:
- user:{user_id}:skills → User's skills and endorsements
- trending:skills → Top 50 trending skills
- user:{user_id}:feed → Personalized feed items
- opportunity:{opportunity_id} → Job opportunity details
- connection_suggestions:{user_id} → Suggested connections
\`\`\`

---

## Migration Roadmap

### Phase 1: Foundation (Month 1)
- Users, profiles, skills tables
- Basic relationships
- Authentication infrastructure

### Phase 2: Core Features (Month 2)
- Credentials and verification
- Projects and portfolio
- Opportunities and applications

### Phase 3: Advanced Features (Month 3)
- Career paths and recommendations
- Advanced messaging
- Analytics and trending data

### Phase 4: Scale & Optimize (Month 4+)
- Partitioning and indexing optimization
- Archival processes
- Real-time analytics pipeline

---

## Security & Privacy

### Data Protection
- All passwords use bcrypt hashing
- Sensitive data (phone, SSN) encrypted at rest
- PII follows GDPR/privacy regulations

### Access Control
- Row-level security on user data
- Role-based access control (RBAC)
- Audit logging on credential verifications

### Backup Strategy
- Nightly full backups
- Hourly transaction logs
- Point-in-time recovery enabled
- Geo-redundant replication

---

## Monitoring & Alerting

### Key Metrics
- Connection pool utilization
- Query execution time percentiles
- Index hit ratios
- Disk space usage
- Replication lag

### Alerts
- Query execution time > 5 seconds
- Disk usage > 80%
- Connection pool > 90%
- Failed verification attempts > threshold

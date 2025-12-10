-- Seed data for thebridgesl (PostgreSQL)
-- Runs safely with existing schema created by Prisma

BEGIN;

-- Clear existing data (preserves enum types)
TRUNCATE TABLE
  messages,
  verification_requests,
  course_skills,
  courses,
  skill_gaps,
  career_path_nodes,
  career_paths,
  notifications,
  feed_items,
  connection_requests,
  connections,
  applications,
  opportunity_skills,
  opportunity_requirements,
  opportunities,
  endorsements,
  project_collaborators,
  project_skills,
  project_media,
  projects,
  credential_skills,
  credentials,
  trending_skills,
  user_skills,
  skills,
  learner_profiles,
  users
RESTART IDENTITY CASCADE;

-- Users
INSERT INTO users (id, email, name, password_hash, avatar, role, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice Johnson', '$2a$10$examplehashalice', NULL, 'STUDENT', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob Smith', '$2a$10$examplehashbob', NULL, 'STUDENT', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'carol@example.com', 'Carol Lee', '$2a$10$examplehashcarol', NULL, 'EMPLOYER', now(), now());

-- Learner profiles
INSERT INTO learner_profiles (user_id, bio, location, phone, website, university, major, graduation_year, current_job_title, current_company, linkedin_url, github_url, portfolio_url, skills_match_percentage, verification_status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Full-stack developer focused on React/Node.', 'Austin, TX', '+1-555-1000', 'https://alice.dev', 'UT Austin', 'Computer Science', 2024, 'Software Engineer', 'TechNova', 'https://linkedin.com/in/alice', 'https://github.com/alice', 'https://alice.dev/portfolio', 75, 'VERIFIED'),
  ('22222222-2222-2222-2222-222222222222', 'Data enthusiast exploring ML.', 'Seattle, WA', '+1-555-2000', NULL, 'UW', 'Informatics', 2025, 'Data Analyst Intern', 'Insight Corp', 'https://linkedin.com/in/bob', 'https://github.com/bob', NULL, 40, 'PENDING');

-- Skills
INSERT INTO skills (id, name, category, description, verified, trending, created_at) VALUES
  ('aaaaaaa1-0000-0000-0000-000000000001', 'JavaScript', 'TECHNICAL', 'ES6+ and TypeScript', true, true, now()),
  ('aaaaaaa2-0000-0000-0000-000000000002', 'React', 'TECHNICAL', 'React 18 + Next.js', true, true, now()),
  ('aaaaaaa3-0000-0000-0000-000000000003', 'Node.js', 'TECHNICAL', 'API development', false, false, now()),
  ('aaaaaaa4-0000-0000-0000-000000000004', 'SQL', 'TECHNICAL', 'PostgreSQL basics', false, false, now()),
  ('aaaaaaa5-0000-0000-0000-000000000005', 'Communication', 'SOFT_SKILL', 'Clear written and verbal', false, true, now());

-- User skills
INSERT INTO user_skills (id, user_id, skill_id, level, endorsements, verified, added_at) VALUES
  ('bbbbbbb1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-0000-0000-0000-000000000001', 'ADVANCED', 3, true, now()),
  ('bbbbbbb2-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'aaaaaaa2-0000-0000-0000-000000000002', 'ADVANCED', 2, true, now()),
  ('bbbbbbb3-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'aaaaaaa4-0000-0000-0000-000000000004', 'INTERMEDIATE', 1, false, now()),
  ('bbbbbbb4-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'aaaaaaa5-0000-0000-0000-000000000005', 'ADVANCED', 0, false, now());

-- Trending skills
INSERT INTO trending_skills (skill_id, demand_percentage, growth_rate, average_salary, open_positions, updated_at) VALUES
  ('aaaaaaa2-0000-0000-0000-000000000002', 75.25, 12.50, 130000, 2400, now()),
  ('aaaaaaa4-0000-0000-0000-000000000004', 55.10, 8.20, 105000, 1800, now());

-- Credentials
INSERT INTO credentials (id, user_id, title, issuer, type, issue_date, expiry_date, verified, blockchain_hash, qr_code, created_at) VALUES
  ('ccccccc1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'AWS Certified Cloud Practitioner', 'Amazon', 'CERTIFICATION', '2023-05-01', NULL, true, NULL, NULL, now()),
  ('ccccccc2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Google Data Analytics', 'Google', 'COURSE_COMPLETION', '2024-01-15', NULL, false, NULL, NULL, now());

-- Credential skills
INSERT INTO credential_skills (credential_id, skill_id) VALUES
  ('ccccccc1-0000-0000-0000-000000000001', 'aaaaaaa3-0000-0000-0000-000000000003'),
  ('ccccccc1-0000-0000-0000-000000000001', 'aaaaaaa4-0000-0000-0000-000000000004'),
  ('ccccccc2-0000-0000-0000-000000000002', 'aaaaaaa4-0000-0000-0000-000000000004');

-- Projects
INSERT INTO projects (id, user_id, title, description, visibility, verified, github_url, live_url, start_date, end_date, created_at, updated_at) VALUES
  ('ddddddd1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Career Navigator', 'AI-assisted career planning tool', 'PUBLIC', false, 'https://github.com/alice/career-navigator', 'https://career.example.com', '2024-02-01', NULL, now(), now()),
  ('ddddddd2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Data Dashboard', 'Analytics dashboard with charts', 'PUBLIC', false, 'https://github.com/bob/data-dashboard', NULL, '2023-11-01', '2024-02-15', now(), now());

-- Project media
INSERT INTO project_media (id, project_id, type, url, thumbnail, caption, display_order) VALUES
  ('eeeeeee1-0000-0000-0000-000000000001', 'ddddddd1-0000-0000-0000-000000000001', 'IMAGE', 'https://pics.example.com/career-cover.png', NULL, 'Landing page', 0),
  ('eeeeeee2-0000-0000-0000-000000000002', 'ddddddd2-0000-0000-0000-000000000002', 'IMAGE', 'https://pics.example.com/dashboard.png', NULL, 'Overview', 0);

-- Project skills
INSERT INTO project_skills (project_id, skill_id) VALUES
  ('ddddddd1-0000-0000-0000-000000000001', 'aaaaaaa2-0000-0000-0000-000000000002'),
  ('ddddddd1-0000-0000-0000-000000000001', 'aaaaaaa3-0000-0000-0000-000000000003'),
  ('ddddddd2-0000-0000-0000-000000000002', 'aaaaaaa1-0000-0000-0000-000000000001'),
  ('ddddddd2-0000-0000-0000-000000000002', 'aaaaaaa4-0000-0000-0000-000000000004');

-- Project collaborators
INSERT INTO project_collaborators (project_id, user_id, role, joined_at) VALUES
  ('ddddddd1-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Contributor', now()),
  ('ddddddd2-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Reviewer', now());

-- Endorsements (project targets)
INSERT INTO endorsements (id, target_id, target_type, endorser_id, comment, created_at) VALUES
  ('fffffff1-0000-0000-0000-000000000001', 'ddddddd1-0000-0000-0000-000000000001', 'PROJECT', '22222222-2222-2222-2222-222222222222', 'Great UX and clear roadmap.', now());

-- Opportunities
INSERT INTO opportunities (id, title, company, company_logo, type, location, remote, description, salary_min, salary_max, posted_date, deadline, application_url, created_at) VALUES
  ('ggggggg1-0000-0000-0000-000000000001', 'Frontend Engineer', 'TechNova', NULL, 'JOB', 'Austin, TX', true, 'Build UI components and design systems.', 110000, 140000, '2024-08-01', '2024-09-15', 'https://jobs.technova.com/frontend', now()),
  ('ggggggg2-0000-0000-0000-000000000002', 'Data Analyst Intern', 'Insight Corp', NULL, 'INTERNSHIP', 'Seattle, WA', false, 'Support analytics team with dashboards.', 60000, 75000, '2024-07-20', '2024-08-31', 'https://careers.insight.com/da-intern', now());

-- Opportunity requirements
INSERT INTO opportunity_requirements (id, opportunity_id, requirement, display_order) VALUES
  ('hhhhhhh1-0000-0000-0000-000000000001', 'ggggggg1-0000-0000-0000-000000000001', '3+ years with React/TypeScript', 1),
  ('hhhhhhh2-0000-0000-0000-000000000002', 'ggggggg2-0000-0000-0000-000000000002', 'SQL and basic statistics', 1);

-- Opportunity skills
INSERT INTO opportunity_skills (opportunity_id, skill_id) VALUES
  ('ggggggg1-0000-0000-0000-000000000001', 'aaaaaaa2-0000-0000-0000-000000000002'),
  ('ggggggg1-0000-0000-0000-000000000001', 'aaaaaaa1-0000-0000-0000-000000000001'),
  ('ggggggg2-0000-0000-0000-000000000002', 'aaaaaaa4-0000-0000-0000-000000000004');

-- Applications
INSERT INTO applications (id, user_id, opportunity_id, status, cover_letter, resume_url, applied_at, updated_at) VALUES
  ('iiiiiii1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'ggggggg1-0000-0000-0000-000000000001', 'APPLIED', 'Excited to contribute to TechNova.', 'https://files.example.com/resume-alice.pdf', now(), now()),
  ('iiiiiii2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'ggggggg2-0000-0000-0000-000000000002', 'APPLIED', NULL, NULL, now(), now());

-- Connections
INSERT INTO connections (id, user_id, connected_user_id, type, mutual_connections, connected_at) VALUES
  ('jjjjjjj1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'PEER', 5, now()),
  ('jjjjjjj2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'RECRUITER', 2, now());

-- Connection requests
INSERT INTO connection_requests (id, sender_id, receiver_id, message, status, requested_at, responded_at) VALUES
  ('kkkkkkk1-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Let’s connect about frontend roles.', 'PENDING', now(), NULL);

-- Feed items
INSERT INTO feed_items (id, type, user_id, priority, title, description, image, data, timestamp) VALUES
  ('lllllll1-0000-0000-0000-000000000001', 'OPPORTUNITY', '11111111-1111-1111-1111-111111111111', 'HIGH', 'New role: Frontend Engineer', 'TechNova is hiring React engineers.', NULL, NULL, now()),
  ('lllllll2-0000-0000-0000-000000000002', 'SKILL_TRENDING', '22222222-2222-2222-2222-222222222222', 'MEDIUM', 'SQL demand rising', 'More roles now ask for SQL.', NULL, NULL, now());

-- Notifications
INSERT INTO notifications (id, user_id, type, title, message, read, action_url, icon, timestamp) VALUES
  ('mmmmmmm1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'OPPORTUNITY', 'Application received', 'TechNova received your application.', false, 'https://jobs.technova.com/status/1', NULL, now()),
  ('mmmmmmm2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'SKILL', 'SQL is trending', 'Consider strengthening SQL for upcoming roles.', false, NULL, NULL, now());

-- Career paths
INSERT INTO career_paths (id, user_id, current_role, target_role, estimated_duration, created_at) VALUES
  ('nnnnnnn1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Frontend Engineer', 'Staff Engineer', 18, now());

-- Career path nodes
INSERT INTO career_path_nodes (id, career_path_id, stage_number, title, duration, completed) VALUES
  ('ooooooo1-0000-0000-0000-000000000001', 'nnnnnnn1-0000-0000-0000-000000000001', 1, 'Lead feature teams', 6, false),
  ('ooooooo2-0000-0000-0000-000000000002', 'nnnnnnn1-0000-0000-0000-000000000001', 2, 'Architect design systems', 6, false);

-- Skill gaps
INSERT INTO skill_gaps (id, career_path_id, skill_id, current_level, target_level, priority) VALUES
  ('ppppppp1-0000-0000-0000-000000000001', 'nnnnnnn1-0000-0000-0000-000000000001', 'aaaaaaa4-0000-0000-0000-000000000004', 'INTERMEDIATE', 'ADVANCED', 'HIGH');

-- Courses
INSERT INTO courses (id, title, provider, description, thumbnail, duration, level, rating, review_count, price, url, created_at) VALUES
  ('qqqqqqq1-0000-0000-0000-000000000001', 'Advanced React Patterns', 'Frontend Masters', 'Patterns for scalable React apps.', NULL, 12, 'ADVANCED', 4.7, 820, 24900, 'https://frontendmasters.com/react-patterns', now()),
  ('qqqqqqq2-0000-0000-0000-000000000002', 'Practical SQL', 'DataCamp', 'Hands-on SQL for analytics.', NULL, 10, 'INTERMEDIATE', 4.5, 1200, 9900, 'https://datacamp.com/practical-sql', now());

-- Course skills
INSERT INTO course_skills (course_id, skill_id) VALUES
  ('qqqqqqq1-0000-0000-0000-000000000001', 'aaaaaaa2-0000-0000-0000-000000000002'),
  ('qqqqqqq2-0000-0000-0000-000000000002', 'aaaaaaa4-0000-0000-0000-000000000004');

-- Verification requests
INSERT INTO verification_requests (id, credential_id, requested_by, status, requested_at, processed_at, blockchain_hash) VALUES
  ('rrrrrrr1-0000-0000-0000-000000000001', 'ccccccc1-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'PENDING', now(), NULL, NULL);

-- Messages
INSERT INTO messages (id, sender_id, receiver_id, content, read, sent_at) VALUES
  ('sssssss1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hey Bob, great dashboard project!', false, now()),
  ('sssssss2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Thanks Alice, appreciate the feedback!', false, now());

COMMIT;


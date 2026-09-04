-- DevLabs e-commerce — seed data for the 15 launch courses (99 lessons)
-- Run once in the Supabase SQL Editor, after 0005_courses.sql, against an
-- otherwise-empty courses table. Plain inserts, not re-run-safe.
--
-- Lesson videos are real, publicly playable MP4s (MDN's cc0 sample clip and
-- three archive.org-hosted Blender Foundation films, rotated across
-- lessons) — the source list this was drafted from cited Google's old
-- gtv-videos-bucket sample videos, but that bucket now returns 403
-- Access Denied to anonymous requests, so every reference was swapped for
-- a verified-working URL instead. Swap for real content (Supabase Storage /
-- Mux / Cloudflare Stream) before launch. Every course's first two lessons
-- are free previews.
--
-- Thumbnails are served locally from public/courses/ (generated icon-on-
-- gradient illustrations, 16:9, one per course topic).

-- =========================================================================
-- Courses
-- =========================================================================

insert into public.courses (title, slug, description, price, compare_at_price, thumbnail_url, status) values
  (
    'Red Team Fundamentals: Ethical Hacking with Kali Linux',
    'red-team-fundamentals',
    'Learn offensive security the way working pentesters do — recon, exploitation, and privilege escalation inside a legal lab you build yourself. Ends with the deliverable that actually gets paid for: the report.',
    5999, 11999,
    '/courses/red-team-fundamentals.png',
    'active'
  ),
  (
    'DSA in JavaScript: From Recursion to Dynamic Programming',
    'dsa-javascript',
    'The interview-critical data structures and algorithms, taught entirely in JavaScript so you''re not translating from C++ under pressure. Pattern-first, not problem-count-first.',
    6999, 13999,
    '/courses/dsa-javascript.png',
    'active'
  ),
  (
    'Building Production LLM Apps: RAG, Agents & Evals',
    'production-llm-apps',
    'The gap between a RAG demo and a RAG product is retrieval quality, evals, and cost control. This course is about that gap.',
    7999, 15999,
    '/courses/production-llm-apps.png',
    'active'
  ),
  (
    'The MERN Launchpad: Ship a Full-Stack SaaS',
    'mern-launchpad',
    'Build and deploy one real subscription product end to end — schema, auth, payments, uploads, background jobs, monitoring. The flagship track, and the longest.',
    8999, 17999,
    '/courses/mern-launchpad.png',
    'active'
  ),
  (
    'System Design for Interviews: Scaling to 10M Users',
    'system-design-interviews',
    'A repeatable framework for open-ended design questions, plus the trade-off vocabulary interviewers are listening for. Two full mock interviews included.',
    6999, 14999,
    '/courses/system-design-interviews.png',
    'active'
  ),
  (
    'DevOps on AWS: Docker, Kubernetes & CI/CD',
    'devops-aws',
    'Containers, orchestration, and pipelines with the parts nobody demos — secrets, rollbacks, and what happens when you''re the one on call.',
    7499, 14999,
    '/courses/devops-aws.png',
    'active'
  ),
  (
    'Advanced React: Server Components, Suspense & Performance',
    'advanced-react',
    'For developers who already ship React and keep getting surprised by it. Rendering model, streaming, and measurable performance work.',
    5499, 10999,
    '/courses/advanced-react.png',
    'active'
  ),
  (
    'Backend Engineering with Node.js: APIs, Auth & Queues',
    'backend-nodejs',
    'Server-side Node beyond CRUD tutorials — the event loop, auth you can defend in review, Postgres relations, Redis, and background jobs.',
    5999, 11999,
    '/courses/backend-nodejs.png',
    'active'
  ),
  (
    'SQL & Analytics Engineering: From Queries to Data Models',
    'sql-analytics-engineering',
    'Start with set-based thinking, end with a version-controlled data model and a dashboard stakeholders actually trust.',
    4999, 9999,
    '/courses/sql-analytics-engineering.png',
    'active'
  ),
  (
    'Python for Automation: Scripts, Scrapers & Schedulers',
    'python-automation',
    'The cheapest, fastest win in this catalogue — automate the repetitive parts of your job in an afternoon, then put it on a schedule.',
    3499, 6999,
    '/courses/python-automation.png',
    'active'
  ),
  (
    'React Native in Production: Ship to App Store & Play Store',
    'react-native-production',
    'Most React Native courses stop at the simulator. This one ends with signed builds live in both stores, notifications included.',
    5999, 11999,
    '/courses/react-native-production.png',
    'active'
  ),
  (
    'AWS Solutions Architect Associate: Certification Sprint',
    'aws-saa-sprint',
    'Exam-shaped, not encyclopaedia-shaped. Covers the services SAA-C03 actually weights, and ends with a full timed practice exam.',
    4499, 8999,
    '/courses/aws-saa-sprint.png',
    'active'
  ),
  (
    'Solidity & Smart Contracts: Build a DeFi App',
    'solidity-smart-contracts',
    'Write, test, exploit, and then harden your own contracts. Security-first, because on-chain bugs are permanent and expensive.',
    6499, 12999,
    '/courses/solidity-smart-contracts.png',
    'active'
  ),
  (
    'AI Engineering with Claude: Tool Use, MCP & Agentic Workflows',
    'ai-engineering-claude',
    'Treat prompting as engineering. Structured outputs, tool use, Model Context Protocol, and how to tell whether your agent got better or just got louder.',
    7499, 14999,
    '/courses/ai-engineering-claude.png',
    'active'
  ),
  (
    'Rust for Systems Programmers: Memory, Concurrency & CLI Tools',
    'rust-systems',
    'Ownership and borrowing explained until they click, then straight into traits, fearless concurrency, and publishing a real CLI to crates.io.',
    5499, 10999,
    '/courses/rust-systems.png',
    'active'
  );

-- =========================================================================
-- Lessons — position is 0-indexed; the first two lessons of every course
-- are free previews (is_preview = true).
-- =========================================================================

-- 1. Red Team Fundamentals
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Setting Up Your Kali Lab Safely', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 0, true),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Reconnaissance: OSINT and Network Mapping', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 1, true),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Vulnerability Scanning with Nmap and Nessus', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 2, false),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Exploiting Web Apps: The OWASP Top 10 in Practice', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 3, false),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Privilege Escalation on Linux and Windows', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 4, false),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Writing a Pentest Report Clients Will Pay For', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 5, false);

-- 2. DSA in JavaScript
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'dsa-javascript'), 'How to Think About Time and Space Complexity', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Arrays, Hash Maps, and the Two-Pointer Pattern', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 1, true),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Linked Lists, Stacks, and Queues From Scratch', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 2, false),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Recursion and Backtracking: N-Queens to Sudoku', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Trees, Tries, and Graph Traversal (BFS/DFS)', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 4, false),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Dynamic Programming: Memoization to Tabulation', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 5, false),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Solving 20 Interview Problems Live', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 6, false);

-- 3. Building Production LLM Apps
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'production-llm-apps'), 'Why Most RAG Demos Fail in Production', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 0, true),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Chunking, Embeddings, and Vector Stores That Scale', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 1, true),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Retrieval Quality: Reranking and Hybrid Search', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 2, false),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Tool Use and Multi-Step Agent Loops', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 3, false),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Evals: Measuring Whether Your App Got Better', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 4, false),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Cost, Latency, and Prompt Caching Strategies', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 5, false),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Shipping: Observability and Guardrails', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 6, false);

-- 4. The MERN Launchpad
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'mern-launchpad'), 'Project Tour: What We''re Building and Why', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 0, true),
  ((select id from public.courses where slug = 'mern-launchpad'), 'MongoDB Schema Design for Real Products', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 1, true),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Express APIs with Auth, Roles, and Validation', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 2, false),
  ((select id from public.courses where slug = 'mern-launchpad'), 'React Frontend: State, Forms, and Data Fetching', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Razorpay and Stripe: Taking Real Payments', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 4, false),
  ((select id from public.courses where slug = 'mern-launchpad'), 'File Uploads, Transactional Email, and Queues', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 5, false),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Deploying to Production and Monitoring It', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 6, false),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Post-Launch: Analytics, Errors, and Iteration', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 7, false);

-- 5. System Design for Interviews
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'system-design-interviews'), 'The Framework: How to Answer Any Design Question', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Load Balancing, Caching, and CDNs', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 1, true),
  ((select id from public.courses where slug = 'system-design-interviews'), 'SQL vs NoSQL: Choosing and Defending Your Database', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 2, false),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Sharding, Replication, and Consistency Trade-offs', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Message Queues and Event-Driven Architecture', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 4, false),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Mock Interview: Design Instagram', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 5, false),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Mock Interview: Design a Distributed Rate Limiter', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 6, false);

-- 6. DevOps on AWS
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'devops-aws'), 'What DevOps Actually Means on a Real Team', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'devops-aws'), 'Docker: Images, Layers, and Multi-Stage Builds', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 1, true),
  ((select id from public.courses where slug = 'devops-aws'), 'Kubernetes Core: Pods, Services, and Deployments', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 2, false),
  ((select id from public.courses where slug = 'devops-aws'), 'Helm, ConfigMaps, and Secrets Management', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 3, false),
  ((select id from public.courses where slug = 'devops-aws'), 'CI/CD Pipelines with GitHub Actions', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 4, false),
  ((select id from public.courses where slug = 'devops-aws'), 'Terraform: Infrastructure as Code on AWS', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 5, false),
  ((select id from public.courses where slug = 'devops-aws'), 'Monitoring, Logging, and On-Call Basics', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 6, false);

-- 7. Advanced React
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'advanced-react'), 'The Rendering Model You Need to Unlearn', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 0, true),
  ((select id from public.courses where slug = 'advanced-react'), 'Server Components vs Client Components', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 1, true),
  ((select id from public.courses where slug = 'advanced-react'), 'Suspense, Streaming, and Honest Loading States', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 2, false),
  ((select id from public.courses where slug = 'advanced-react'), 'Memoization: When useMemo Actually Helps', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'advanced-react'), 'Profiling and Fixing Slow Renders', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 4, false),
  ((select id from public.courses where slug = 'advanced-react'), 'Building an Accessible Component Library', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 5, false);

-- 8. Backend Engineering with Node.js
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'backend-nodejs'), 'Node''s Event Loop, Explained Properly', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Designing REST APIs You Won''t Regret', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 1, true),
  ((select id from public.courses where slug = 'backend-nodejs'), 'JWT, Sessions, and OAuth Done Right', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 2, false),
  ((select id from public.courses where slug = 'backend-nodejs'), 'PostgreSQL with Prisma: Migrations and Relations', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 3, false),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Redis for Caching, Sessions, and Rate Limits', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 4, false),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Background Jobs with BullMQ', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 5, false),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Testing, Structured Logging, and Error Handling', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 6, false);

-- 9. SQL & Analytics Engineering
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'SQL Mental Models: Thinking in Sets', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 0, true),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Joins, CTEs, and Window Functions', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 1, true),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Query Performance: Indexes and Execution Plans', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 2, false),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Dimensional Modelling: Facts and Dimensions', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'dbt: Transformations as Version-Controlled Code', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 4, false),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Building a Dashboard Stakeholders Trust', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 5, false);

-- 10. Python for Automation
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'python-automation'), 'Your First Useful Script in 20 Minutes', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'python-automation'), 'Files, Folders, and Bulk Renaming', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 1, true),
  ((select id from public.courses where slug = 'python-automation'), 'Web Scraping with Requests and BeautifulSoup', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 2, false),
  ((select id from public.courses where slug = 'python-automation'), 'Working with APIs, JSON, and Pagination', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 3, false),
  ((select id from public.courses where slug = 'python-automation'), 'Excel and PDF Automation with openpyxl and pypdf', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 4, false),
  ((select id from public.courses where slug = 'python-automation'), 'Scheduling with cron and GitHub Actions', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 5, false);

-- 11. React Native in Production
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'react-native-production'), 'Expo vs Bare Workflow: Choosing Correctly', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'react-native-production'), 'Navigation and Layout That Feels Native', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 1, true),
  ((select id from public.courses where slug = 'react-native-production'), 'Native Modules, Camera, and Permissions', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 2, false),
  ((select id from public.courses where slug = 'react-native-production'), 'Offline Storage and Sync', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'react-native-production'), 'Push Notifications End-to-End', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 4, false),
  ((select id from public.courses where slug = 'react-native-production'), 'Builds, Code Signing, and Store Submission', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 5, false);

-- 12. AWS Solutions Architect Associate
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'Exam Blueprint and a Realistic Study Plan', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 0, true),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'IAM, Organizations, and Shared Responsibility', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 1, true),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'EC2, EBS, and Auto Scaling Groups', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 2, false),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'S3, Storage Classes, and Lifecycle Rules', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 3, false),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'VPC, Subnets, and Security Groups', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 4, false),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'RDS, DynamoDB, and Caching Choices', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 5, false),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'Full-Length Practice Exam Walkthrough', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 6, false);

-- 13. Solidity & Smart Contracts
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'How Ethereum Actually Executes Your Code', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Solidity Basics: Types, Storage, and Gas', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 1, true),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'ERC-20 and ERC-721 From Scratch', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 2, false),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Testing and Deploying with Hardhat', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Common Exploits: Reentrancy and Integer Overflow', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 4, false),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Connecting a React Frontend with wagmi', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 5, false);

-- 14. AI Engineering with Claude
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Prompting as Engineering, Not Guesswork', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 0, true),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Structured Outputs and Reliable JSON', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 1, true),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Tool Use: Letting the Model Call Your Code', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 2, false),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Model Context Protocol: Connecting Real Data', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 3, false),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Multi-Agent Orchestration and Handoffs', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 4, false),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Evaluating and Debugging Agent Failures', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 5, false),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Cost Control, Caching, and Context Limits', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 6, false);

-- 15. Rust for Systems Programmers
insert into public.course_lessons (course_id, title, video_url, position, is_preview) values
  ((select id from public.courses where slug = 'rust-systems'), 'Ownership and Borrowing, Finally Clear', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 0, true),
  ((select id from public.courses where slug = 'rust-systems'), 'Structs, Enums, and Pattern Matching', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 1, true),
  ((select id from public.courses where slug = 'rust-systems'), 'Error Handling with Result and the ? Operator', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 2, false),
  ((select id from public.courses where slug = 'rust-systems'), 'Traits, Generics, and Lifetimes', 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', 3, false),
  ((select id from public.courses where slug = 'rust-systems'), 'Fearless Concurrency with Threads and Channels', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', 4, false),
  ((select id from public.courses where slug = 'rust-systems'), 'Building and Publishing a Real CLI Tool', 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4', 5, false);

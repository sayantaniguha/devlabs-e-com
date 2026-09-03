-- Adds course metadata that existed in the original seed brief but was
-- never stored (category, level, duration), plus a ratings/reviews system
-- for courses, gated so only enrolled buyers can review — matching the
-- "enrollment gate" security posture already applied to course_lessons.
--
-- Also seeds 75 sample reviews (5 per course) so the catalogue/sales pages
-- have something to render during development. These are placeholder
-- content — reviewer_name is a plain string with no linked account (see
-- below) — and should be deleted before real launch the same way the
-- placeholder product/course seed data should be.

-- =========================================================================
-- Course metadata
-- =========================================================================

alter table public.courses
  add column category text,
  add column level text,
  add column duration_hours numeric;

update public.courses set category = 'Security',                  level = 'Intermediate',         duration_hours = 22 where slug = 'red-team-fundamentals';
update public.courses set category = 'Programming',                level = 'Beginner–Advanced',    duration_hours = 38 where slug = 'dsa-javascript';
update public.courses set category = 'AI & Machine Learning',      level = 'Intermediate',         duration_hours = 26 where slug = 'production-llm-apps';
update public.courses set category = 'Web Development',            level = 'Beginner–Advanced',    duration_hours = 52 where slug = 'mern-launchpad';
update public.courses set category = 'Career & Interview Prep',    level = 'Intermediate',         duration_hours = 24 where slug = 'system-design-interviews';
update public.courses set category = 'Cloud & DevOps',             level = 'Intermediate',         duration_hours = 34 where slug = 'devops-aws';
update public.courses set category = 'Web Development',            level = 'Advanced',             duration_hours = 18 where slug = 'advanced-react';
update public.courses set category = 'Web Development',            level = 'Intermediate',         duration_hours = 30 where slug = 'backend-nodejs';
update public.courses set category = 'Data & Analytics',           level = 'Beginner',             duration_hours = 20 where slug = 'sql-analytics-engineering';
update public.courses set category = 'Programming',                level = 'Beginner',             duration_hours = 14 where slug = 'python-automation';
update public.courses set category = 'Mobile Development',         level = 'Intermediate',         duration_hours = 24 where slug = 'react-native-production';
update public.courses set category = 'Cloud & DevOps',             level = 'Beginner',             duration_hours = 28 where slug = 'aws-saa-sprint';
update public.courses set category = 'Blockchain',                 level = 'Intermediate',         duration_hours = 21 where slug = 'solidity-smart-contracts';
update public.courses set category = 'AI & Machine Learning',      level = 'Intermediate',         duration_hours = 19 where slug = 'ai-engineering-claude';
update public.courses set category = 'Programming',                level = 'Intermediate',         duration_hours = 25 where slug = 'rust-systems';

-- =========================================================================
-- Reviews
-- =========================================================================

-- user_id is nullable and only ever set for a real customer's own review
-- (enforced by the insert policy below); reviewer_name is a denormalized
-- snapshot so display never needs to join profiles. Seed rows below have
-- user_id = null on purpose — they aren't tied to real accounts.
create table public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  reviewer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (course_id, user_id)
);
create index course_reviews_course_id_idx on public.course_reviews (course_id);

alter table public.course_reviews enable row level security;

create policy "course_reviews_select_all" on public.course_reviews
  for select using (true);

-- A review can only be created by the account it's attributed to, and only
-- if that account is actually enrolled in the course — this is the real
-- "verified purchase" gate, enforced at the database.
create policy "course_reviews_insert_own_enrolled" on public.course_reviews
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.enrollments e
      where e.course_id = course_reviews.course_id and e.user_id = auth.uid()
    )
  );

create policy "course_reviews_update_own" on public.course_reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "course_reviews_delete_own" on public.course_reviews
  for delete using (auth.uid() = user_id);

-- 1. Red Team Fundamentals
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Aisha Farouk',   5, 'The lab setup section alone was worth the price. Finally a course that treats OPSEC as part of the curriculum, not an afterthought.', now() - interval '52 days'),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Rohan Deshmukh', 5, 'Went from barely knowing what Nmap was to writing a report I actually used for a client engagement.', now() - interval '41 days'),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Karan Bhatia',   4, 'Solid course. Privilege escalation module could use a few more Windows-specific examples.', now() - interval '30 days'),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Meera Joshi',    5, 'The reporting lesson is criminally underrated content for this price point.', now() - interval '19 days'),
  ((select id from public.courses where slug = 'red-team-fundamentals'), 'Yash Chatterjee',4, 'Good pacing throughout, felt very hands-on rather than slide-heavy.', now() - interval '8 days');

-- 2. DSA in JavaScript
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'dsa-javascript'), 'Priya Sharma',   5, 'Best DSA course I''ve taken. The pattern-first approach actually made problems click instead of just memorizing.', now() - interval '55 days'),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Vikram Thakur',  5, 'DP section is the clearest explanation of memoization to tabulation I''ve seen anywhere.', now() - interval '44 days'),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Divya Nair',     4, 'Very thorough. Wish the graph traversal lesson was split into two, it moves fast.', now() - interval '33 days'),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Sameer Qureshi', 5, 'Landed two offers after grinding through this. The 20 live problems module is gold.', now() - interval '20 days'),
  ((select id from public.courses where slug = 'dsa-javascript'), 'Tanvi Gupta',    5, 'No fluff, straight into patterns. Exactly what I needed for interview prep.', now() - interval '6 days');

-- 3. Building Production LLM Apps
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'production-llm-apps'), 'Nikhil Verma',  5, 'Finally a RAG course that talks about evals instead of just stitching a vector DB to a prompt.', now() - interval '48 days'),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Isha Wadhwa',   4, 'Reranking and hybrid search lesson changed how I think about retrieval quality entirely.', now() - interval '37 days'),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Aditya Hegde',  5, 'The cost and latency module alone saved my team real money in production.', now() - interval '25 days'),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Riya Zaveri',   5, 'Agent loops section is dense but worth rewatching twice.', now() - interval '14 days'),
  ((select id from public.courses where slug = 'production-llm-apps'), 'Varun Oberoi',  4, 'Great practical depth, though it assumes you already know basic prompting.', now() - interval '3 days');

-- 4. The MERN Launchpad
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'mern-launchpad'), 'Ananya Krishnan', 5, 'Genuinely shipped a working SaaS by the end. The deployment and monitoring module is what separates this from every other MERN tutorial.', now() - interval '58 days'),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Arjun Pillai',    5, 'Longest course in the catalogue and it earns every hour. Payments integration lesson is excellent.', now() - interval '47 days'),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Sneha Rao',       4, 'Comprehensive but dense — budget more than a weekend for this one.', now() - interval '36 days'),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Pooja Lal',       5, 'The post-launch analytics and error-tracking lesson is something most courses skip entirely.', now() - interval '22 days'),
  ((select id from public.courses where slug = 'mern-launchpad'), 'Rohan Deshmukh',  5, 'Worth it just for the schema design lesson. Changed how I structure every project now.', now() - interval '9 days');

-- 5. System Design for Interviews
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'system-design-interviews'), 'Karan Bhatia',    5, 'The framework lesson alone is worth more than three months of reading random blog posts.', now() - interval '50 days'),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Meera Joshi',      5, 'Mock interview breakdowns are brutally honest in the best way. Passed my onsite after this.', now() - interval '39 days'),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Yash Chatterjee',  4, 'Rate limiter mock interview is fantastic, wish there were a few more of these.', now() - interval '27 days'),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Aisha Farouk',     5, 'Trade-off vocabulary section is exactly what interviewers are listening for. Recommended.', now() - interval '16 days'),
  ((select id from public.courses where slug = 'system-design-interviews'), 'Nikhil Verma',     3, 'Good content but assumes some prior distributed-systems exposure.', now() - interval '5 days');

-- 6. DevOps on AWS
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'devops-aws'), 'Isha Wadhwa',   5, 'The on-call and monitoring lesson is the part every other DevOps course pretends doesn''t exist.', now() - interval '53 days'),
  ((select id from public.courses where slug = 'devops-aws'), 'Divya Nair',    4, 'Terraform module is clear and practical. Kubernetes section moves quickly if you''re new to it.', now() - interval '42 days'),
  ((select id from public.courses where slug = 'devops-aws'), 'Sameer Qureshi',5, 'Secrets management lesson fixed three bad habits I didn''t know I had.', now() - interval '31 days'),
  ((select id from public.courses where slug = 'devops-aws'), 'Vikram Thakur', 5, 'CI/CD pipeline walkthrough is exactly the kind of end-to-end example I needed.', now() - interval '18 days'),
  ((select id from public.courses where slug = 'devops-aws'), 'Tanvi Gupta',   4, 'Great course overall, would love a follow-up on multi-cluster setups.', now() - interval '7 days');

-- 7. Advanced React
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'advanced-react'), 'Aditya Hegde',  5, 'The rendering model lesson finally explained why my "optimizations" kept making things worse.', now() - interval '46 days'),
  ((select id from public.courses where slug = 'advanced-react'), 'Riya Zaveri',   5, 'Server vs Client Components breakdown is the clearest I''ve seen, and I''ve read the docs three times.', now() - interval '34 days'),
  ((select id from public.courses where slug = 'advanced-react'), 'Varun Oberoi',  4, 'Profiling lesson is great but pretty advanced — not for React beginners.', now() - interval '23 days'),
  ((select id from public.courses where slug = 'advanced-react'), 'Ananya Krishnan',5,'useMemo lesson should be mandatory viewing before anyone touches a performance PR.', now() - interval '12 days'),
  ((select id from public.courses where slug = 'advanced-react'), 'Arjun Pillai',  5, 'Short, dense, no wasted time. Exactly what an "advanced" course should be.', now() - interval '2 days');

-- 8. Backend Engineering with Node.js
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'backend-nodejs'), 'Sneha Rao',    5, 'Event loop lesson finally made async behavior make sense instead of just working by trial and error.', now() - interval '49 days'),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Pooja Lal',    4, 'Auth section is thorough — JWT vs sessions trade-offs explained better than most paid bootcamps.', now() - interval '38 days'),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Karan Bhatia', 5, 'BullMQ lesson alone saved me a week of documentation spelunking.', now() - interval '26 days'),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Meera Joshi',  5, 'Redis rate-limiting example is something I copy-pasted straight into production, works great.', now() - interval '15 days'),
  ((select id from public.courses where slug = 'backend-nodejs'), 'Yash Chatterjee',4,'Solid backend fundamentals course, testing module could be a bit longer.', now() - interval '4 days');

-- 9. SQL & Analytics Engineering
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Aisha Farouk',  5, 'Thinking in sets lesson rewired how I write every query now, not an exaggeration.', now() - interval '51 days'),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Nikhil Verma',  5, 'dbt module is a great intro if you''ve only ever written raw SQL scripts before.', now() - interval '40 days'),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Isha Wadhwa',   4, 'Window functions lesson is great. Wish there were more practice queries included.', now() - interval '29 days'),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Aditya Hegde',  5, 'Dimensional modelling finally clicked after years of vague blog posts about star schemas.', now() - interval '17 days'),
  ((select id from public.courses where slug = 'sql-analytics-engineering'), 'Riya Zaveri',   5, 'Beginner-friendly but doesn''t talk down to you. Great for a first analytics engineering course.', now() - interval '6 days');

-- 10. Python for Automation
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'python-automation'), 'Varun Oberoi',   5, 'Automated my entire weekly reporting job in one afternoon using lesson 1 and 5. Paid for itself immediately.', now() - interval '54 days'),
  ((select id from public.courses where slug = 'python-automation'), 'Ananya Krishnan',5, 'Great starting point if you''ve never scripted before. Scraping lesson is very approachable.', now() - interval '43 days'),
  ((select id from public.courses where slug = 'python-automation'), 'Arjun Pillai',   4, 'Short and practical, exactly what "automation" courses should be instead of 40-hour epics.', now() - interval '32 days'),
  ((select id from public.courses where slug = 'python-automation'), 'Sneha Rao',      5, 'The cron and GitHub Actions scheduling lesson is a genuinely useful skill most tutorials skip.', now() - interval '21 days'),
  ((select id from public.courses where slug = 'python-automation'), 'Pooja Lal',      5, 'Cheapest course in the catalogue and probably the highest ROI. Recommended for total beginners.', now() - interval '10 days');

-- 11. React Native in Production
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'react-native-production'), 'Karan Bhatia',   5, 'Only course I''ve found that actually gets to store submission instead of stopping at the simulator.', now() - interval '45 days'),
  ((select id from public.courses where slug = 'react-native-production'), 'Meera Joshi',    4, 'Push notifications end-to-end lesson saved me days of trial and error with FCM.', now() - interval '33 days'),
  ((select id from public.courses where slug = 'react-native-production'), 'Yash Chatterjee',5, 'Expo vs Bare Workflow lesson answered a question I''d been confused about for months.', now() - interval '24 days'),
  ((select id from public.courses where slug = 'react-native-production'), 'Tanvi Gupta',    5, 'Code signing and store submission module is worth the price on its own.', now() - interval '13 days'),
  ((select id from public.courses where slug = 'react-native-production'), 'Aisha Farouk',   4, 'Solid production-focused course, offline sync lesson is a bit fast-paced.', now() - interval '1 days');

-- 12. AWS Solutions Architect Associate
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'Nikhil Verma',  5, 'Passed SAA-C03 on the first try using this and the practice exam walkthrough. Exam-shaped is the right word for it.', now() - interval '56 days'),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'Isha Wadhwa',   5, 'Doesn''t waste time on services the exam barely touches, unlike most cert courses.', now() - interval '44 days'),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'Aditya Hegde',  4, 'VPC and networking module is dense but exactly what''s tested.', now() - interval '31 days'),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'Riya Zaveri',   5, 'Practice exam walkthrough at the end mirrors the real exam format closely.', now() - interval '19 days'),
  ((select id from public.courses where slug = 'aws-saa-sprint'), 'Varun Oberoi',  5, 'Best value cert prep course I''ve bought. Clear, focused, no filler.', now() - interval '7 days');

-- 13. Solidity & Smart Contracts
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Ananya Krishnan', 5, 'The exploits lesson is genuinely scary in a good way — reentrancy finally makes sense as a real risk, not a trivia fact.', now() - interval '47 days'),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Arjun Pillai',     4, 'Hardhat testing module is solid. Wish there was more coverage of upgradeable contracts.', now() - interval '35 days'),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Sneha Rao',        5, 'wagmi frontend integration lesson ties everything together nicely.', now() - interval '24 days'),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Pooja Lal',         5, 'Security-first framing throughout is what sets this apart from other Solidity courses.', now() - interval '11 days'),
  ((select id from public.courses where slug = 'solidity-smart-contracts'), 'Rohan Deshmukh',    4, 'ERC-20 and ERC-721 lesson is a clean, no-nonsense walkthrough. Good course overall.', now() - interval '2 days');

-- 14. AI Engineering with Claude
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Karan Bhatia',    5, 'MCP lesson is the clearest explanation of the protocol I''ve found anywhere, including the official docs.', now() - interval '52 days'),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Meera Joshi',      5, 'Treats prompting as a real engineering discipline instead of vibes. Structured outputs module is excellent.', now() - interval '40 days'),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Yash Chatterjee',  4, 'Multi-agent orchestration lesson is dense but very rewarding once it clicks.', now() - interval '28 days'),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Tanvi Gupta',      5, 'Evaluating agent failures is the lesson every AI course should have and almost none do.', now() - interval '15 days'),
  ((select id from public.courses where slug = 'ai-engineering-claude'), 'Aisha Farouk',     5, 'Cost control and context limits section paid for the course within a week of applying it.', now() - interval '3 days');

-- 15. Rust for Systems Programmers
insert into public.course_reviews (course_id, reviewer_name, rating, comment, created_at) values
  ((select id from public.courses where slug = 'rust-systems'), 'Nikhil Verma', 5, 'Ownership and borrowing finally clicked after years of bouncing off the compiler. This is the explanation I needed.', now() - interval '48 days'),
  ((select id from public.courses where slug = 'rust-systems'), 'Isha Wadhwa',  5, 'Fearless concurrency lesson is excellent — channels finally make sense as more than a buzzword.', now() - interval '37 days'),
  ((select id from public.courses where slug = 'rust-systems'), 'Aditya Hegde', 4, 'Traits and lifetimes module is tough but the course doesn''t rush it, which I appreciated.', now() - interval '25 days'),
  ((select id from public.courses where slug = 'rust-systems'), 'Riya Zaveri',  5, 'Publishing a real CLI to crates.io as the capstone is a great way to end the course.', now() - interval '14 days'),
  ((select id from public.courses where slug = 'rust-systems'), 'Varun Oberoi', 5, 'Best Rust intro for people coming from garbage-collected languages. Highly recommended.', now() - interval '2 days');

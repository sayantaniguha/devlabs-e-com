-- Replaces the course thumbnail_url values (currently /courses/<slug>.svg,
-- set by the earlier 0008_local_generated_images.sql run) with generated
-- icon-on-gradient illustrations, served locally from public/courses/.
-- Run once in the Supabase SQL Editor.

update public.courses set thumbnail_url = '/courses/red-team-fundamentals.png' where slug = 'red-team-fundamentals';
update public.courses set thumbnail_url = '/courses/dsa-javascript.png' where slug = 'dsa-javascript';
update public.courses set thumbnail_url = '/courses/production-llm-apps.png' where slug = 'production-llm-apps';
update public.courses set thumbnail_url = '/courses/mern-launchpad.png' where slug = 'mern-launchpad';
update public.courses set thumbnail_url = '/courses/system-design-interviews.png' where slug = 'system-design-interviews';
update public.courses set thumbnail_url = '/courses/devops-aws.png' where slug = 'devops-aws';
update public.courses set thumbnail_url = '/courses/advanced-react.png' where slug = 'advanced-react';
update public.courses set thumbnail_url = '/courses/backend-nodejs.png' where slug = 'backend-nodejs';
update public.courses set thumbnail_url = '/courses/sql-analytics-engineering.png' where slug = 'sql-analytics-engineering';
update public.courses set thumbnail_url = '/courses/python-automation.png' where slug = 'python-automation';
update public.courses set thumbnail_url = '/courses/react-native-production.png' where slug = 'react-native-production';
update public.courses set thumbnail_url = '/courses/aws-saa-sprint.png' where slug = 'aws-saa-sprint';
update public.courses set thumbnail_url = '/courses/solidity-smart-contracts.png' where slug = 'solidity-smart-contracts';
update public.courses set thumbnail_url = '/courses/ai-engineering-claude.png' where slug = 'ai-engineering-claude';
update public.courses set thumbnail_url = '/courses/rust-systems.png' where slug = 'rust-systems';

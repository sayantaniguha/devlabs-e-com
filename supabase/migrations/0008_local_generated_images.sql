-- Replaces the placehold.co stand-in images with real generated artwork
-- shipped as static assets under /public — gradient-mesh cards with
-- hand-drawn line-art icons for merch, and abstract duotone covers for
-- courses. Served locally (no external host, no next.config.mjs changes
-- needed) from public/products/, public/courses/, and public/hero/.

update public.product_images set url = '/products/ship-it-oversized-tee.svg'
  where product_id = (select id from public.products where slug = 'ship-it-oversized-tee') and position = 0;
update public.product_images set url = '/products/404-not-found-tee.svg'
  where product_id = (select id from public.products where slug = '404-not-found-tee') and position = 0;
update public.product_images set url = '/products/terminal-black-hoodie.svg'
  where product_id = (select id from public.products where slug = 'terminal-black-hoodie') and position = 0;
update public.product_images set url = '/products/xl-desk-mousepad-dark-mode.svg'
  where product_id = (select id from public.products where slug = 'xl-desk-mousepad-dark-mode') and position = 0;
update public.product_images set url = '/products/devlabs-laptop-backpack.svg'
  where product_id = (select id from public.products where slug = 'devlabs-laptop-backpack') and position = 0;
update public.product_images set url = '/products/insulated-steel-water-bottle.svg'
  where product_id = (select id from public.products where slug = 'insulated-steel-water-bottle') and position = 0;
update public.product_images set url = '/products/git-commit-ceramic-mug.svg'
  where product_id = (select id from public.products where slug = 'git-commit-ceramic-mug') and position = 0;
update public.product_images set url = '/products/laptop-sticker-pack-12.svg'
  where product_id = (select id from public.products where slug = 'laptop-sticker-pack-12') and position = 0;

-- Signature Hoodie keeps its 4-image gallery, now as 4 distinct generated shots.
update public.product_images set url = '/products/devlabs-signature-hoodie.svg'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 0;
update public.product_images set url = '/products/devlabs-signature-hoodie-1.svg'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 1;
update public.product_images set url = '/products/devlabs-signature-hoodie-2.svg'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 2;
update public.product_images set url = '/products/devlabs-signature-hoodie-3.svg'
  where product_id = (select id from public.products where slug = 'devlabs-signature-hoodie') and position = 3;

update public.courses set thumbnail_url = '/courses/red-team-fundamentals.svg' where slug = 'red-team-fundamentals';
update public.courses set thumbnail_url = '/courses/dsa-javascript.svg' where slug = 'dsa-javascript';
update public.courses set thumbnail_url = '/courses/production-llm-apps.svg' where slug = 'production-llm-apps';
update public.courses set thumbnail_url = '/courses/mern-launchpad.svg' where slug = 'mern-launchpad';
update public.courses set thumbnail_url = '/courses/system-design-interviews.svg' where slug = 'system-design-interviews';
update public.courses set thumbnail_url = '/courses/devops-aws.svg' where slug = 'devops-aws';
update public.courses set thumbnail_url = '/courses/advanced-react.svg' where slug = 'advanced-react';
update public.courses set thumbnail_url = '/courses/backend-nodejs.svg' where slug = 'backend-nodejs';
update public.courses set thumbnail_url = '/courses/sql-analytics-engineering.svg' where slug = 'sql-analytics-engineering';
update public.courses set thumbnail_url = '/courses/python-automation.svg' where slug = 'python-automation';
update public.courses set thumbnail_url = '/courses/react-native-production.svg' where slug = 'react-native-production';
update public.courses set thumbnail_url = '/courses/aws-saa-sprint.svg' where slug = 'aws-saa-sprint';
update public.courses set thumbnail_url = '/courses/solidity-smart-contracts.svg' where slug = 'solidity-smart-contracts';
update public.courses set thumbnail_url = '/courses/ai-engineering-claude.svg' where slug = 'ai-engineering-claude';
update public.courses set thumbnail_url = '/courses/rust-systems.svg' where slug = 'rust-systems';
